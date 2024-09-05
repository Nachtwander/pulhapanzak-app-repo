import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  imageOutline,
  personOutline,
} from 'ionicons/icons';
import {
  IonIcon,
  IonLabel,
  IonTabBar, // elmento necesario para hacer tabs
  IonTabButton, // elmento necesario para hacer tabs
  IonTabs, // elmento necesario para hacer tabs
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      personOutline,
      imageOutline,
    });
  }
}
