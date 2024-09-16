import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NotificationService } from './services/notification-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private notificationService: NotificationService =
    inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.initializePushNotifications();
  }
  //final AppComponent
}
