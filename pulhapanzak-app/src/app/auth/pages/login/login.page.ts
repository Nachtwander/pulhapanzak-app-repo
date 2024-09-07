import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loginDto } from '../../models/login.dto';
import { addIcons } from 'ionicons';
import { atCircleOutline, lockOpenOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth/auth.service';
//se importa Router que se utiliza para navegar entre paginas en la aplicacion
import { Router } from '@angular/router';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonSpinner,
  IonNote,
  IonIcon,
  ToastController,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonSpinner,
    ReactiveFormsModule, //importamos para poder hacer el Binding <form [formGroup]="registerForm">
    IonNote,
    IonIcon,
    IonInputPasswordToggle,
  ],
  styles: [
    `
      //ngClass para input cuando sea valido
      .ionInputStyle {
        color: black;
        border: 2px solid black;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
      }

      //ngClass para input cuando sea invalido o nulo
      .ionInputStyle-invalid {
        color: black;
        border: 2px solid red;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
      }
    `,
  ],
})
export class LoginPage {
  //creamos variable que sera del tipo del servicio AuthService (services\auth) para autenticar al usuario
  private _authService: AuthService = inject(AuthService);
  //se usa para navegar entre paginas
  private _router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  //variable para utilizar toast alert
  private _toastController: ToastController = inject(ToastController);
  //variable para controlar si se muestra la animacion de circulo de carga en el boton Registrar
  spinner: boolean = false;

  disabled: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    contraseña: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    addIcons({
      'at-circle-outline': atCircleOutline,
      'lock-open-outline': lockOpenOutline,
    });
  }

  //get para verificar si el formulario es invalido y si es true desativa el boton con [disabled]
  get isFormInvalid(): boolean {
    return this.loginForm.invalid;
  }

  //get que verifica que el campo correo no sea nulo, si el usuario no ingresa un correo valido
  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.loginForm.get('correo');
    return control ? control.hasError('required') && control.touched : false;
  }

  //get para verificar que el email sea valido
  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.loginForm.get('correo');
    return control ? control.hasError('email') && control.touched : false;
  }

  //get que verifica que el campo contraseña no sea nulo
  // y toca sin ingresar datos se mostrara el ion-note *
  //get para que password no sea menor de 6 caracteres
  get isPasswordMinLengthInvalid(): boolean {
    const control: AbstractControl | null = this.loginForm.get('contraseña');
    if (control && control.touched) {
      return control.hasError('minlength') || control.value.length < 6;
    }
    return false;
  }

  //funcion onSubmit del ngSubmit del form
  onSubmit(): void {
    if (!this.isFormInvalid) {
      //para deshabilitar el boton y no puedan darle clic 2 veces al login
      this.disabled = true;
      //para activar la animacion del spinner
      this.spinner = true;
      //que parsee informacion de la variable que implementa loginDto a la de loginform como loginDTO
      const login: loginDto = this.loginForm.value as loginDto;

      //logica de lo que hara cuando se presione el boton de login
      this._authService
        .login(login)
        .then(async (user) => {
          this.spinner = false;
          this.disabled = false;
          console.log(user);
          //mostrara una alerta cuando se ingrese con exito
          await this.showAlert('Ingreso con exito');
          this._router.navigate(['/tabs/home']);
          this.resetForm();
        })
        .catch(async () => {
          this.spinner = false;
          this.disabled = false;
          //si hay un error mostrara una alerta indicando error
          await this.showAlert(
            'Correo o Contraseña Invalido, intente de nuevo',
            true
          );
        });
    }
  }

  goToRegister(){
    this.resetForm();
    this._router.navigate(['/register']);
  }

  goToRForgotPassword(){
    this.resetForm();
    this._router.navigate(['/forgot-password']);
  }

  resetForm(): void {
    this.loginForm.reset();
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
