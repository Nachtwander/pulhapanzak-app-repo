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
  User,
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

  //si hay un usuario loggueado va a devolver un true y si no un false
  //la promesa va a devolver el boolean
  async isUserLoggued(): Promise <boolean> {
    return new Promise <boolean> ((resolve)=>{
      this._auth.onAuthStateChanged((user: User | null)=>{
        if(user) {
          resolve(true)
        } else{
          resolve(false)
        }
      })
    })
  }

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
      telefono: user.telefono,
    });
  }

  //metodo asincronico de login que utiliza la interface de loginDTO que es del tipo promesa
  //la promesa es una credencial de usuario.
  async login(model: loginDto): Promise<UserCredential> {
    // esta promesa rechaza el intento de loguin cuando estan loggueados
    const isUserLoggued : boolean = await this.isUserLoggued();
    if (isUserLoggued) return Promise.reject('Ya hay un usuario en uso')

    return await signInWithEmailAndPassword(
      this._auth,
      model.correo,
      model.contraseña
    );
  }

  //metodo asincronico para registrar un usuario con correo y contraseña
  async singUp(model: registerDto): Promise<UserCredential> {
    // esta promesa rechaza el intento de registro cuando estan loggueados
    const isUserLoggued : boolean = await this.isUserLoggued();
    if (isUserLoggued) return Promise.reject('Ya hay un usuario en uso')

    return await createUserWithEmailAndPassword(
      this._auth,
      model.correo,
      model.contraseña
    );
  }

  //metodo asincronico para cerrar sesion
  async singOut(): Promise<void> {
    const isUserLoggued : boolean = await this.isUserLoggued();
    if (isUserLoggued){
      return await this._auth.signOut();
    }
    return await this._auth.signOut();
  }

  //metodo para hacer reset del password
  async resetPassword(model: passwordResetDto): Promise<void> {
    return await sendPasswordResetEmail(this._auth, model.correo);
  }
  //final
}
