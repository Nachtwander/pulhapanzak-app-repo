import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterPage } from 'src/app/auth/pages/register/register.page';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  ToastController,
  IonNote,
} from '@ionic/angular/standalone';
import { registerDto } from 'src/app/auth/models/register.dto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RegisterPage,
    IonButton,
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  //creamos variable que sera del tipo del servicio AuthService (services\auth) para autenticar al usuario
  private _authService: AuthService = inject(AuthService);
  //se usa para navegar entre paginas
  private _router: Router = inject(Router);
  //variable para utilizar toast alert
  private _toastController: ToastController = inject(ToastController);

  usuario: registerDto | null = null;
  usuariologgued: string = '';

  constructor() {}

  async logOut(): Promise<void> {
    await this._authService
      .singOut()
      .then(async () => {
        this._router.navigate(['/login']);
        await this.showAlert('se ha cerrardo la sesion');
      })
      .catch(async (error) => {
        await this.showAlert(
          'ocurrio un error al intentar cerrar la sesion',
          true
        );
      });
  }

  async showAlert(message: string, isError: boolean = false): Promise<void> {
    const toast = await this._toastController.create({
      //recibe el texto desde onSubmit().
      message: message,
      duration: 2000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }

  //utilizamos el ngOnInit para probar el metodo getCurrentUser de AuthService
  async ngOnInit(): Promise<void> {
    //getUserByID
    try {
      // Obtener usuario por ID
      const user = await this._authService.getUserByID();
      this.usuario = user;
      if (this.usuario) {
        this.usuariologgued = `${this.usuario.nombres} ${this.usuario.apellidos}`;
      }
      console.log('userByID => ', user);
    } catch {
      await this.showAlert(
        'ocurrió un error al intentar obtener datos de sesión (getUserByID)',
        true
      );
    }

    //getUserByQuery
    await this._authService
      .getUserByQuery()
      .then(async (user) => {
        console.log('userByQuery => ', user);
      })
      .catch(async (error) => {
        console.log('error => ', error);
        await this.showAlert(
          'ocurrio un error al intentar obtener datos de sesión (getUserByQuery)',
          true
        );
      });
  }
  //final
}
