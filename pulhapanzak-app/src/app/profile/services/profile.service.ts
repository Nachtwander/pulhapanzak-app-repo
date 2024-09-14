import { inject, Injectable } from '@angular/core';
import {
  Storage,
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from '@angular/fire/storage';

const folder: string = 'users';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _storage: Storage = inject(Storage);

  private isValidUrl(image: string): boolean {
    return image.includes('http://') || image.includes('https://');
  }

  async uploadImage(image: string, userId: string): Promise<string> {
    try {
      if (!this.isValidUrl(image)) return image;

      const url = `${folder}/${userId}.png`; //url sera igual al folder y la ruta con userID y guardara la imagen en tipo.jpg, podemos usar .avi o .mp4 para subir videos.
      const storageReference = ref(this._storage, url);
      //variable que recibe el valor del storage de firebase, si no hay nada se convierte en nulo
      const imageExist = await getDownloadURL(storageReference).catch(
        () => null
      );
      //sila imagen existe en el folder y tiene el userID, es decir tiene un valor distinto de nulo,
      //eliminara dicha imagen
      if (imageExist) {
        await deleteObject(ref(this._storage, imageExist)).catch(() => null);
      }

      const file = await fetch(image); //fetch
      const imageBlob = await file.blob(); //pasamos a blob
      const result = await uploadBytes(storageReference, imageBlob); //subimos la imagen
      const imageUrl = await getDownloadURL(result.ref); //descargamos la imagen
      return imageUrl; //obtenemos el url
    } catch (error) {
      console.log('error => ', error);
      throw new Error('Error al subir la imagen.');
    }
  }
  //final
}
