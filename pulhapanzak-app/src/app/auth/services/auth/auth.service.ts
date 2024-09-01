import { inject, Injectable } from '@angular/core';
import { loginDto } from '../../models/login.dto';
import { registerDto } from '../../models/register.dto';
import { passwordResetDto } from '../../models/passwordReset.dto';
// importamos lo necesario para la autenticacion
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  
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

  // creamos coleccion y le mandamos como parametros firestore y un string de con el nombre de la coleccion
  private _collection: CollectionReference = collection(this._firestore, PATH);

  constructor() {}

  //metodo asincronico de creacion de usuarios
  async createUserInfirestore(user: registerDto): Promise<void> {
    //variable docRef que es un documento de referencia que recibe la informacion de usuarios
    const docRef: DocumentReference = doc(this._collection, user.uid);
    //agregamos metodo setDoc para guardar la informacion de este usuario
    await setDoc(docRef, {
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      dni: user.dni,
      telefono: user.telefono
    });
  }

  //metodo asincronico de login que utiliza la interface de loginDTO que es del tipo promesa
  //la promesa es una credencial de usuario.
  async login(model: loginDto): Promise<UserCredential> {
    return await signInWithEmailAndPassword(
      this._auth,
      model.correo,
      model.contraseña
    );
  }

  //metodo asincronico para registrar un usuario con correo y contraseña
  async singUp(model: registerDto): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(
      this._auth,
      model.correo,
      model.contraseña
    );
  }

  //metodo asincronico para cerrar sesion
  async singOut(): Promise<void> {
    return await this._auth.signOut();
  }

  async resetPassword(model: passwordResetDto):Promise <void> {
    return await sendPasswordResetEmail(
      this._auth,
      model.correo
    )
  }

}

