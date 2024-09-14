import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, Observable, of, tap } from 'rxjs';
import { postDto } from '../models/post.dto';

const apiUrl = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  //injectamos HttpClient
  private _http: HttpClient = inject(HttpClient);

  //ToastController para manejar las alertas
  private _toastController: ToastController = inject(ToastController);

  //devuelve results como arreglo de postDto
  getPosts(): Observable<{ results: postDto[] }> {
    return this._http.get<{ results: postDto[] }>(`${apiUrl}`).pipe(
      tap((response: { results: postDto[] }) => response),
      catchError(
        this.handleError<{ results: postDto[] }>(
          'Error al intentar obtener los Posts',
          { results: [] }
        )
      )
    );
  }

  getPost(id: number) {
    // usamos {apiUrl}${id} por que apiUrl ya tiene / al final (API_URL: 'https://rickandmortyapi.com/api/character/')
    return this._http.get<postDto>(`${apiUrl}${id}`).pipe(
      //tap pasara el json al tipo del modelo
      tap((response: postDto) => response),
      catchError(
        this.handleError<postDto>(
          'Error al intentar obtener el Post',
          {} as postDto
        )
      )
      /*catchError((error)=>{
          this.showAlert(
            'Ha ocurrido un error, vuelva a intentarlo mas tarde', true);
            throw error;
          )
      }) */
    );
  }

  deletePost(id: number) {
    return this._http.delete(`${apiUrl}${id}`).pipe(
      //tap obtiene algo vacio (_)
      tap((_) => this.showAlert('Post Eliminado correctamente')),
      catchError(this.handleError('Error al intentar eliminar el Post', true))
    );
  }

  //T es por Type, va a recibir el tipo del error que maneje,
  //recibe un mensaje de tipo string, y un result dinamico que recibe el tipo.
  //result?: T en TypeScript significa que result puede existir o no, y si existe, será del tipo T
  private handleError<T>(message: string, result?: T) {
    return (): Observable<T> => {
      //`${message}` viene de catchError(this.handleError<type>('message')
      this.showAlert(`${message}`, true);
      return of(result as T);
    };
  }

  //showAlert para manejar las alertas del toastController
  private async showAlert(
    message: string,
    isError: boolean = false
  ): Promise<void> {
    const toast = await this._toastController.create({
      //recibe el texto desde onSubmit().
      message: message,
      duration: 2000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }

  constructor() {}
}
