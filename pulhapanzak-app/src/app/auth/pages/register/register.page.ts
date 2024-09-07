import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerDto } from '../../models/register.dto';
import { addIcons } from 'ionicons';
import { atCircleOutline, lockOpenOutline, personOutline, idCardOutline, callOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth/auth.service';
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
  IonInputPasswordToggle,
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
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
export class RegisterPage{
  /*
  "Estamos creando una propiedad privada llamada formBuilder que es del tipo FormBuilder, y la estamos inicializando 
  usando la función inject para obtener una instancia de FormBuilder."
  Esto significa que formBuilder será una instancia de FormBuilder, obtenida a través de la inyección de dependencias, 
  lo que permite que la clase que contiene esta línea pueda usar formBuilder para construir 
  formularios reactivos o realizar otras operaciones relacionadas con formularios en Angular.
  */
  private formBuilder: FormBuilder = inject(FormBuilder);

  //variable que implementa la interfaz registerDTO
  registerDTO: registerDto = {} as registerDto;

  //variable para controlar si se muestra la animacion de circulo de carga en el boton Registrar
  spinner: boolean = false;

  //creamos variable que sera del tipo del servicio AuthService (services\auth) para autenticar al usuario
  private _authService: AuthService = inject(AuthService);
  //se usa para navegar entre paginas
  private _router: Router = inject(Router);

  //variable para utilizar toast alert
  private _toastController: ToastController = inject(ToastController);


  disabled: boolean = false;

  /*
  "Estamos creando una propiedad llamada registerForm, que es del tipo FormGroup. Inicialmente, 
  la estamos configurando como un grupo vacío utilizando el método group del formBuilder." 
  En términos más simples:
  -> registerForm es una variable que almacenará un formulario.
  -> FormGroup es el tipo de esta variable, indicando que es un grupo de controles de formulario.
  -> this.formBuilder.group({}) es el método que usamos para crear un grupo de controles de formulario. 
     En este caso, estamos creando un formulario reactivo llamado registerForm, que es un FormGroup 
     con varios campos: nombres, apellidos, email, password, dni y telefono. 
     Cada uno de estos campos se inicializa con un valor vacío, lo que significa que están listos para ser llenados
      por el usuario."
  */
  registerForm: FormGroup = this.formBuilder.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    contraseña: ['', [Validators.required, Validators.minLength(6)]],
    dni: [
      '',
      [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    telefono: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
  });

  //get para verificar si el formulario es invalido y si es true desativa el boton con [disabled]
  get isFormInvalid(): boolean {
    return this.registerForm.invalid;
  }

  //get ppara verificar que el campo nombres no este null
  get isNombresNull(): boolean {
    const control: AbstractControl | null = this.registerForm.get('nombres');
    return control ? control.invalid && control.touched : false;
  }

  //get ppara verificar que el campo apellidos no este null
  get isApellidosNull(): boolean {
    const control: AbstractControl | null = this.registerForm.get('apellidos');
    return control ? control.invalid && control.touched : false;
  }

  //get que verifica que el campo correo no sea nulo, si el usuario no ingresa un correo valido
  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('correo');
    return control ? control.hasError('required') && control.touched : false;
  }

  //get para verificar que el email sea valido
  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('correo');
    return control ? control.hasError('email') && control.touched : false;
  }

  //get que verifica que el campo contraseña no sea nulo
  // y toca sin ingresar datos se mostrara el ion-note *
  //get para que password no sea menor de 6 caracteres
  get isPasswordMinLengthInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('contraseña');
    if (control && control.touched) {
      return control.hasError('minlength') || control.value.length < 6;
    }
    return false;
  }

  //get para que dni no sea menor de 13 caracteres
  // Verificar si el valor del control es una cadena antes de acceder a length
  get isDniMinLengthInvalid(): boolean {
    const control = this.registerForm.get('dni');
    if (control && control.touched) {
      const value = control.value || ''; // Asegúrate de que el valor sea una cadena
      return control.hasError('minlength') || value.length < 13;
    }
    return false;
  }

  //get para que dni no sea mayor de 13 caracteres
  // Verificar si el valor del control es una cadena antes de acceder a length
  get isDniMaxLengthInvalid(): boolean {
    const control = this.registerForm.get('dni');
    if (control) {
      const value = control.value || ''; // Asegúrate de que el valor sea una cadena
      return control.hasError('maxlength') || value.length > 13;
    }
    return false;
  }

  // get para verificar que el campo dni no tenga letras
  // Verificar si el valor del control es una cadena antes de realizar la prueba de letras o espacios
  get isDniHasLettersOrSpaces(): boolean {
    const control = this.registerForm.get('dni');
    if (control) {
      const value = control.value || ''; // Asegúrate de que el valor sea una cadena
      const hasLettersOrSpaces = /[a-zA-Z\s]/.test(value); // Verifica si hay letras o espacios en el valor
      return hasLettersOrSpaces;
    }
    return false;
  }

  //get para verificar que el telefono no sea null
  get isTelefonoInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('telefono');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isTelefonoIMinInvalid(): boolean {
    const control = this.registerForm.get('telefono');
    if (control && control.touched) {
      const value = control.value || ''; // Asegúrate de que el valor sea una cadena
      return control.hasError('minlength') || value.length < 8;
    }
    return false;
  }

  //summit del formulario
  onSubmit(): void {
    if (!this.isFormInvalid) {
      //para deshabilitar el boton y no puedan darle clic 2 veces al login
      this.disabled = true;
      //para activar la animacion del spinner
      this.spinner = true;
      //declaramos la variable newUser que seria ugual a los valores del formulario de registo y se parsearan al tipo registerDto
      let newUser: registerDto = this.registerForm.value as registerDto;

      this._authService.singUp(newUser).then(async (result) => {
        newUser.uid = result.user.uid;
        await this._authService.createUserInfirestore(newUser).then (async () =>{
          this.spinner = false;
          this.disabled = false;
          console.log(result);
          //mostrara una alerta cuando se ingrese con exito
          await this.showAlert('Usuario registrado con exito');
          this._router.navigate(['/tabs/home']);
          this.resetForm();
        });

      }).catch(async () => {
        this.spinner = false;
        this.disabled = false;
        //si hay un error mostrara una alerta indicando error
        await this.showAlert(
          'Ocurrio un error, revise los campos e intentelo de nuevo',
          true
        );
      });
        
    }
  }

  resetForm(): void {
    this.registerForm.reset();
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

  goToLogin(){
    this.resetForm();
    this._router.navigate(['/login']);
  }


  constructor(){
    addIcons({
      'at-circle-outline': atCircleOutline,
      'lock-open-outline': lockOpenOutline,
      'person-outline': personOutline,
      'id-card-outline': idCardOutline,
      'call-outline': callOutline,
    })
  
  }
}

  

