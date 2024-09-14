import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications'; //librerias necesarias para push notification
import { AuthService } from './auth/services/auth/auth.service';
import { registerDto } from './auth/models/register.dto';
import { deviceDto } from './auth/models/device.dto';
import { Timestamp } from "firebase/firestore";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  //injectamos AuthService por que nesecitaremos el usuario
  private _authService: AuthService = inject(AuthService);

  private user: registerDto | null = null;

  ngOnInit(): void {
    //obtenemos el uid del usuario
    this._authService.getUserByID().then((userId: registerDto | null) => {
      this.user = userId;
      this.initializedPushNotifications();
    });
  }

  

  //pedimos permiso al usuario para que funcionen las notificaciones push
  initializedPushNotifications(): void {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    //obtener el token id del dispositivo y guardarlo en firestore
    PushNotifications.addListener('registration', (token: Token) => {
      if (this.user) {
        const device: registerDto = {
          uid: this.user.uid,
          deviceID: token.value,
          nombres: this.user.nombres,
          apellidos: this.user.apellidos,
          correo: this.user.correo,
          contraseña: this.user.contraseña,
          dni: this.user.dni,
          telefono: this.user.telefono,
          imageProfile: this.user.imageProfile,
          birthDate:  this.user.birthDate ? this.user.birthDate : Timestamp.now(),
        };
        this._authService.createDevice(device);
      }
    });
    //para escuchar las alertas
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('pushNotificationReceived -> ', notification);
      }
    );

    //va a recibir las acciones
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('pushNotificationActionPerformed -> ', notification);
      }
    );
  }

  //final AppComponent
}
