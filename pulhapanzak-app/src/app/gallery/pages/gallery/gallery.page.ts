import { Component, inject, OnInit } from '@angular/core';

import { GalleryService } from '../../services/gallery.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ToastController,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { galleryDto } from 'src/app/auth/models/galerry.dto';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class GalleryPage implements OnInit {
  //creamos variable que injectamos GalleryService
  private _galleryService: GalleryService = inject(GalleryService);
  //se usa para navegar entre paginas
  //variable para utilizar toast alert
  private _toastController: ToastController = inject(ToastController);

  galleryItems: galleryDto[] | null = []; // Almacena los elementos de la galería

  constructor() {
    addIcons({ addCircleOutline });
  }

  async ngOnInit(): Promise<void> {
    //getgalleryByQuery
    try {
      const gallery = await this._galleryService.getGalleryByQuery();
      this.galleryItems = gallery; // Asignamos los datos a galleryItems
      console.log('galleryByQuery => ', gallery);
    } catch (error) {
      console.log('error => ', error);
      await this.showAlert(
        'ocurrió un error al intentar obtener datos de galería (getGalleryByQuery)',
        true
      );
    }
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
