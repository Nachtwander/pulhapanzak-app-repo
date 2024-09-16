import { Injectable, inject } from '@angular/core';
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { AuthService } from '../auth/services/auth/auth.service';
import { registerDto } from '../auth/models/register.dto';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  //injectamos AuthService por que nesecitaremos el usuario
  private _authService: AuthService = inject(AuthService);

  private user: registerDto | null = null;

  async initializePushNotifications(): Promise<void> {
    this.user = await this._authService.getUserByID();

    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      if (this.user && token.value) {
        const device: Partial<registerDto> = {
          uid: this.user.uid,
          deviceID: token.value,
        };
        this._authService.createDevice(device as registerDto);
      }
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('pushNotificationReceived -> ', notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('pushNotificationActionPerformed -> ', notification);
      }
    );
  }
}
