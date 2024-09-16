import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterPage } from 'src/app/auth/pages/register/register.page';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/services/notification-service.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  ToastController,
  IonNote,
  IonItem,
  IonList,
  IonAvatar,
  IonLabel,
} from '@ionic/angular/standalone';
import { registerDto } from 'src/app/auth/models/register.dto';
import { HomeService } from '../../services/home.service';
import { postDto } from '../../models/post.dto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonNote,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RegisterPage,
    IonButton,
    CommonModule,
    IonAvatar,
    IonLabel,
  ],
})
export class HomePage implements OnInit {
  //creamos variable que sera del tipo del servicio AuthService (services\auth) para autenticar al usuario
  private _authService: AuthService = inject(AuthService);
  //se usa para navegar entre paginas
  private _router: Router = inject(Router);
  //variable para utilizar toast alert
  private _toastController: ToastController = inject(ToastController);

  private _homeService: HomeService = inject(HomeService);

  private notificationService: NotificationService =
    inject(NotificationService);

  usuario: registerDto | null = null;
  usuarioLoggued: string = '';

  characters: postDto[] = [];

  constructor() {}

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
    await this.notificationService.initializePushNotifications();
    //getUserByID
    try {
      // Obtener usuario por ID
      const user = await this._authService.getUserByID();
      this.usuario = user;
      if (this.usuario) {
        this.usuarioLoggued = `${this.usuario.nombres} ${this.usuario.apellidos}`;
      }
      //console.log('userByID => ', user);
    } catch {
      await this.showAlert(
        'ocurrió un error al intentar obtener datos de sesión (getUserByID)',
        true
      );
    }

    // usamos servicio getPosts() de HomeService e imprimimos los resultados de la API
    this._homeService.getPosts().subscribe((result) => {
      //console.log(result);
    });

    // usamos servicio getPost(id) de HomeService e imprimimos los resultados de la API
    this._homeService.getPost(5).subscribe((result) => {
      //console.log(result);
    });

    /*this._homeService.deletePost(5).subscribe(result => {
    console.log(result)
   }) */

    this._homeService.getPosts().subscribe(
      (data: { results: postDto[] }) => {
        this.characters = data.results; // Accede al array de personajes
      },
      (error) => {
        console.error('Error fetching characters: ', error);
      }
    );
  }
  //final
}
