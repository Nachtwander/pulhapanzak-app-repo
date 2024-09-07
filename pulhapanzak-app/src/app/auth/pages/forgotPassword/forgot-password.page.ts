import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { atCircleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
//se importa Router que se utiliza para navegar entre paginas en la aplicacion
import { Router } from '@angular/router';
import { passwordResetDto } from 'src/app/auth/models/passwordReset.dto';
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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
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
    ReactiveFormsModule, //importamos para poder hacer el Binding <form [formGroup]="">
    IonNote,
    IonIcon,
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
export class ForgotPasswordPage {
   //creamos variable que sera del tipo del servicio AuthService (services\auth) para autenticar al usuario
   private _authService: AuthService = inject(AuthService);

   //se usa para navegar entre paginas
   private _router: Router = inject(Router);

   private formBuilder: FormBuilder = inject(FormBuilder);

   //variable para utilizar toast alert
   private _toastController: ToastController = inject(ToastController);

   spinner: boolean = false;
 
   disabled: boolean = false;
 
   forgotPasswordForm: FormGroup = this.formBuilder.group({
     correo: ['', [Validators.required, Validators.email]],
   });

   //get para verificar si el formulario es invalido y si es true desativa el boton con [disabled]
  get isFormInvalid(): boolean {
    return this.forgotPasswordForm.invalid;
  }

  //get que verifica que el campo correo no sea nulo, si el usuario no ingresa un correo valido
  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.forgotPasswordForm.get('correo');
    return control ? control.hasError('required') && control.touched : false;
  }

  //get para verificar que el email sea valido
  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.forgotPasswordForm.get('correo');
    return control ? control.hasError('email') && control.touched : false;
  }

  onSubmit(): void {
    if (!this.isFormInvalid) {
      //para deshabilitar el boton y no puedan darle clic 2 veces al login
      this.disabled = true;
      //para activar la animacion del spinner
      this.spinner = true;
      //utilizamos una varible de nombre reset del tipo resetPasswordDto que va a obtener el valor del formulario
      const reset: passwordResetDto = this.forgotPasswordForm.value as passwordResetDto;

      //logica de lo que hara cuando se presione el boton
      this._authService
        //metodo de resetPassword() en Auth recibe la constante reset
        .resetPassword(reset)
        .then(async (r) => {
          this.spinner = false;
          this.disabled = false;
          console.log(r);
          //mostrara una alerta cuando el reset tenga exito
          await this.showAlert('Por favor revise la bandeja de entrada de su correo.');
          this._router.navigate(['/login']);
          this.resetForm();
        })
        .catch(async () => {
          this.spinner = false;
          this.disabled = false;
          //si hay un error mostrara una alerta indicando error
          await this.showAlert(
            'No se encontro el correo, por favor revise e intente de nuevo.',
            true
          );
        });
    }
  }

  goToLogin(){
    this.resetForm();
    this._router.navigate(['/login']);
  }

  resetForm(): void {
    this.forgotPasswordForm.reset();
  }

  async showAlert(message: string, isError: boolean = false): Promise<void> {
    const toast = await this._toastController.create({
      //recibe el texto desde onSubmit().
      message: message,
      duration: 7000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }

 
   constructor() {
     addIcons({
       'at-circle-outline': atCircleOutline,
     });
   }

  
}
