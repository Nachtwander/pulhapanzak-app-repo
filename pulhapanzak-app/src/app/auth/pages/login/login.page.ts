import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loginDto } from '../../models/login.dto';
import { addIcons } from 'ionicons';
import { atCircleOutline, lockOpenOutline } from 'ionicons/icons';

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
  IonNote, IonIcon } from '@ionic/angular/standalone';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, 
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


  private formBuilder: FormBuilder = inject(FormBuilder);

  //variable que implementa la interfaz loginDTO
  loginDTO: loginDto = {} as loginDto;

  //variable para controlar si se muestra la animacion de circulo de carga en el boton Registrar
  spinner: boolean = false;

 
  loginForm: FormGroup = this.formBuilder.group({
    
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  //get para verificar si el formulario es invalido y si es true desativa el boton con [disabled]
  get isFormInvalid(): boolean {
    return this.loginForm.invalid;
  }


  //get que verifica que el campo correo no sea nulo, si el usuario no ingresa un correo valido
  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.loginForm.get('email');
    return control ? control.hasError('required') && control.touched : false;
  }

  //get para verificar que el email sea valido
  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.loginForm.get('email');
    return control ? control.hasError('email') && control.touched : false;
  }

  //get que verifica que el campo contraseña no sea nulo
  // y toca sin ingresar datos se mostrara el ion-note *
  //get para que password no sea menor de 6 caracteres
  get isPasswordMinLengthInvalid(): boolean {
    const control: AbstractControl | null = this.loginForm.get('password');
    if (control && control.touched) {
      return control.hasError('minlength') || control.value.length < 6;
    }
    return false;
  }

  //funcion save del ngSubmit del form
  save(): void {
    this.spinner = true;
    setTimeout(() => {
      this.loginForm.reset();
      this.spinner = false;
    }, 10000);
  }

  constructor(){
    addIcons({
      'at-circle-outline': atCircleOutline,
      'lock-open-outline': lockOpenOutline,
    })
  }
 
}
