import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  private _authService: AuthService = inject(AuthService);

  constructor() { }

  ngOnInit() {
    this._authService.getUserByID().then((user)=>{
      console.log("User => ", user)
    }).catch((error) => {console.log("Error => ", error)});
  }

}
