import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterPage } from 'src/app/auth/pages/register/register.page';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  ToastController,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RegisterPage,
    IonButton,
  ],
})
export class HomePage {
  //creamos variable que sera del tipo del servicio AuthService (services\auth) para autenticar al usuario
  private _authService: AuthService = inject(AuthService);
  //se usa para navegar entre paginas
  private _router: Router = inject(Router);
  //variable para utilizar toast alert
  private _toastController: ToastController = inject(ToastController);

  constructor() {}

  async logOut(): Promise<void> {
    await this._authService
      .singOut()
      .then( async () => {
        this._router.navigate(['/login']);
        await this.showAlert('se ha cerrardo la sesion');
      })
      .catch( async (error) => {
        await this.showAlert('ocurrio un error al intentar cerrar la sesion', true);
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
}
