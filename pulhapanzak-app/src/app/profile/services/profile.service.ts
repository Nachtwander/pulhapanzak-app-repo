import { inject, Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';


const folder: string = 'users';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private storage: Storage = inject(Storage);

  async uploadImage(image: string, userId: string): Promise<string> {
    try {
      const url = `${folder}/${userId}.jpg`; //url sera igual al folder y la ruta con userID y guardara la imagen en tipo.jpg
      const storageReference = ref(this.storage, url);

      const imageExist = await getDownloadURL(storageReference).catch(
        () => null
      );
      //mirar la grabacion en 1:02:40 hrs
    } catch (error) {}
    return '';
  }
}
