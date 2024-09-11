import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerDto } from 'src/app/auth/models/register.dto';
import { addIcons } from 'ionicons';
import { Camera, CameraResultType } from '@capacitor/camera'; //importamos las clases para usar la camara
import {
  atCircleOutline,
  personOutline,
  idCardOutline,
  callOutline,
  calendarOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
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
  ToastController,
  IonImg,
  IonDatetime,
} from '@ionic/angular/standalone';

import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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
    ReactiveFormsModule,
    IonNote,
    IonIcon,
    IonInputPasswordToggle,
    IonImg,
    IonDatetime,
  ],
  styles: [
    `
      .ionInputStyle {
        color: black;
        border: 2px solid black;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
      }
      .ionInputStyle-invalid {
        color: black;
        border: 2px solid red;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
        background-color: white;
      }

      .ionInputDateStyle {
        color: black;
        border: 2px solid black;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
        background-color: white;
        padding: 8px; /* Agrega un padding manual */
      }

      .ionInputDateStyle-invalid {
        color: black;
        border: 2px solid red;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
        background-color: white;
        padding: 8px; /* Agrega un padding manual */
      }
    `,
  ],
})
export class ProfilePage implements OnInit {
  private _authService: AuthService = inject(AuthService);
  user: registerDto = {} as registerDto;
  private _toastController: ToastController = inject(ToastController);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  spinner: boolean = false;
  disabled: boolean = false;
  today = new Date();

  //injectamos Profile Service para usar el metodo uploadImage()
  private _profileService: ProfileService = inject(ProfileService);

  profileForm: FormGroup = this.formBuilder.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    imageProfile: ['', [Validators.required]],
    birthDate: [
      '',
      [Validators.required, Validators.max(new Date().getTime())],
    ],
    uid: ['', [Validators.required]],
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

  get isFormInvalid(): boolean {
    return this.profileForm.invalid;
  }

  get isImageProfileInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('imageProfile');
    return control ? control.invalid : false;
  }

  get isBirthDateInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('birthDate');
    return control ? control.invalid && control.touched : false;
  }

  get isBirthDateInFuture(): boolean {
    const control: AbstractControl | null = this.profileForm.get('birthDate');

    if (control && control.value) {
      const selectedDate = new Date(control.value).getTime();
      const today = new Date().setHours(23, 59, 59, 999); // Para comparar fecha con ultimo segundo del dia
      return selectedDate > today; // Retorna true si la fecha es mayor a la actual
    }

    return false;
  }

  get isNombresNull(): boolean {
    const control: AbstractControl | null = this.profileForm.get('nombres');
    return control ? control.invalid && control.touched : false;
  }

  get isApellidosNull(): boolean {
    const control: AbstractControl | null = this.profileForm.get('apellidos');
    return control ? control.invalid && control.touched : false;
  }

  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.profileForm.get('correo');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('correo');
    return control ? control.hasError('email') && control.touched : false;
  }

  get isDniMinLengthInvalid(): boolean {
    const control = this.profileForm.get('dni');
    if (control && control.touched) {
      const value = control.value || '';
      return control.hasError('minlength') || value.length < 13;
    }
    return false;
  }

  get isDniMaxLengthInvalid(): boolean {
    const control = this.profileForm.get('dni');
    if (control) {
      const value = control.value || ''; // Asegúrate de que el valor sea una cadena
      return control.hasError('maxlength') || value.length > 13;
    }
    return false;
  }

  get isDniHasLettersOrSpaces(): boolean {
    const control = this.profileForm.get('dni');
    if (control) {
      const value = control.value || '';
      const hasLettersOrSpaces = /[a-zA-Z\s]/.test(value);
      return hasLettersOrSpaces;
    }
    return false;
  }

  get isTelefonoInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('telefono');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isTelefonoIMinInvalid(): boolean {
    const control = this.profileForm.get('telefono');
    if (control && control.touched) {
      const value = control.value || '';
      return control.hasError('minlength') || value.length < 8;
    }
    return false;
  }

  constructor() {
    addIcons({personOutline,calendarOutline,atCircleOutline,idCardOutline,callOutline});
  }

  ngOnInit() {
    this._authService
      .getUserByID()
      .then((user) => {
        this.user = user!;
        //el patchValue muestra los valores del usuario en el reactive form profileForm
        this.profileForm.patchValue({
          nombres: this.user.nombres,
          apellidos: this.user.apellidos,
          correo: this.user.correo,
          dni: this.user.dni,
          telefono: this.user.telefono,
          uid: this.user.uid,
          imageProfile: this.user.imageProfile,
          birthDate: this.user.birthDate,
        });
      })
      .catch(async () => {
        await this.showAlert(
          'Ha ocurrido un error al intentar obetener datos del usuario',
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

  onSubmit(): void {
    if (!this.isFormInvalid) {
      this.spinner = true;
      this.disabled = true;
      let user: registerDto = this.profileForm.value as registerDto;
      user.correo = this.user.correo;
      

      this._profileService
        .uploadImage(user.imageProfile, user.uid) //user.imageProfile viene de onPickImage()
        .then(async (url: string) => {
          user.imageProfile = url;
          this._authService
            .updateUser(user)
            .then(async () => {
              this.spinner = false;
              this.disabled = false;
              await this.showAlert('Datos de Usuario Actualizados');
            })
            .catch(async () => {
              this.spinner = false;
              this.disabled = false;
              await this.showAlert('Ha Ocurrido un error', true);
            });
        }).catch(async () => {
          this.spinner = false;
          this.disabled = false;
          await this.showAlert('Ha Ocurrido un error', true);
        });
    }
  }

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

  async onPickImage(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      promptLabelHeader: 'Seleccione una fotografia',
      promptLabelPhoto: 'Elegir de Galeria',
      promptLabelPicture: 'Tomar una foto',
      promptLabelCancel: 'Cancelar',
    });
    if (!image) return;

    this.user.imageProfile = image.webPath ?? image.path ?? '';
    this.profileForm.patchValue({ imageProfile: this.user.imageProfile });
  }

  //final
}
