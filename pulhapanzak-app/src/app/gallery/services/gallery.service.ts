import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User,
} from '@angular/fire/auth';
import {
  CollectionReference,
  Firestore,
  collection,
  DocumentReference,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  orderBy,
  updateDoc,
} from '@angular/fire/firestore';
import { galleryDto } from 'src/app/auth/models/galerry.dto';

const folder: string = 'Galleries';
const PATH: string = 'users';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private _auth: Auth = inject(Auth);
  private _firestore: Firestore = inject(Firestore);
  private _collectionGallery: CollectionReference = collection(this._firestore, folder);
  private _collectionUsers: CollectionReference = collection(this._firestore, PATH);

  
  constructor() {}

  

  //metodo GET para obtener el usuario logueado actual y asi su user.uid
  private async getCurrentUser(): Promise<User | null> {
    return new Promise<User | null>((resolve) => {
      this._auth.onAuthStateChanged((user: User | null) => {
        if (user) {
          
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getGalleryByQuery(): Promise<galleryDto[] | null> {
    const user = await this.getCurrentUser();
    const galleryQuery = query(
      //userQuery toma los datos de una funcion query con el valor de la coleccion usuarios que tengan uid, se puede usar mas de un where
      this._collectionGallery,
      where('uid', '==', user?.uid),
      where('active', '==', true),
      orderBy('createdAt', 'desc') //metodo para ordenar de forma descendente
    );
    const gallerySnapshot = await getDocs(galleryQuery); //galleySnapshot optiene el valor de la galeria con uid
    if (gallerySnapshot.empty) {
      return null; //si esta vacio, datos vacios
    }
    return gallerySnapshot.docs.map(doc => doc.data() as galleryDto); 
// Si gallerySnapshot no está vacío, retorna un array con todos los documentos encontrados.

  }
}
