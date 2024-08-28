import { inject, Injectable } from '@angular/core';
import { loginDto } from '../../models/login.dto';
import { registerDto } from '../../models/register.dto';
// importamos lo necesario para la autenticacion
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

import {
  CollectionReference,
  Firestore,
  collection,
  DocumentReference,
  doc,
  setDoc,
} from '@angular/fire/firestore';

const PATH: string = 'users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //creamos variable _auth de tipo Auth donde se le injecto Auth de angular fire para autentificar usuario.
  private _auth: Auth = inject(Auth);

  //inyectamos clase firestore para usar cuando registremos usuarios
  private _firestore: Firestore = inject(Firestore);

  // creamos coleccion de usuarios de firestore, PATH es un string de usuarios
  private _collection: CollectionReference = collection(this._firestore, PATH);

  constructor() {}

  //ver grabacion en 01:01:00
  async createUserInfirestore(user: registerDto): Promise<void> {
    const docRef: DocumentReference = doc(this._collection, user.uid);
    await setDoc(docRef, user);
  }

  //metodo asincronico de login que utiliza la interface de loginDTO que es del tipo promesa
  //la promesa es una credencial de usuario.
  async login(model: loginDto): Promise<UserCredential> {
    return await signInWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    );
  }

  //metodo asincronico para registrar un usuario con correo y contraseña
  async singUp(model: registerDto): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    );
  }

  //metodo asincronico para cerrar sesion
  async singOut(): Promise<void> {
    return await this._auth.signOut();
  }
}
