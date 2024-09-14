import { inject, Injectable } from '@angular/core';
import { loginDto } from '../../models/login.dto';
import { registerDto } from '../../models/register.dto';
import { passwordResetDto } from '../../models/passwordReset.dto';
import { deviceDto } from '../../models/device.dto';
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
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  orderBy,
  updateDoc,
  addDoc,
} from '@angular/fire/firestore';

const PATH: string = 'users';
const devicePath: string = 'devices';

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

  //metodo asincronico de creacion de usuarios en Firestore con un UID especifico
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
      uid: docRef.id,
      isActive: true,
      imageProfile: '',
      deviceID: '',
    });
  }

  //metodo asincronico de creacion de usuarios en firestore con un UID generado por Firestore
  async createUser(user: registerDto): Promise<void> {
    const docRef: DocumentReference = doc(this._collection);
    await setDoc(docRef, {
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      dni: user.dni,
      telefono: user.telefono,
      uid: docRef.id,
      isActive: true,
      imageProfile: '',
    });
  }

  //metodo asincronico de login que utiliza la interface de loginDTO que es del tipo promesa
  //la promesa es una credencial de usuario.
  async login(model: loginDto): Promise<UserCredential> {
    // esta promesa rechaza el intento de loguin cuando estan loggueados
    const isUserLoggued: boolean = await this.isUserLoggued();
    if (isUserLoggued) return Promise.reject('Ya hay un usuario en uso');

    return await signInWithEmailAndPassword(
      this._auth,
      model.correo,
      model.contraseña
    );
  }

  //metodo asincronico para registrar un usuario con correo y contraseña
  async singUp(model: registerDto): Promise<UserCredential> {
    // esta promesa rechaza el intento de registro cuando estan loggueados
    const isUserLoggued: boolean = await this.isUserLoggued();
    if (isUserLoggued) return Promise.reject('Ya hay un usuario en uso');

    return await createUserWithEmailAndPassword(
      this._auth,
      model.correo,
      model.contraseña
    );
  }

  //metodo asincronico para cerrar sesion
  async singOut(): Promise<void> {
    const isUserLoggued: boolean = await this.isUserLoggued();
    if (isUserLoggued) {
      return await this._auth.signOut();
    }
    return await this._auth.signOut();
  }

  //metodo para hacer reset del password
  async resetPassword(model: passwordResetDto): Promise<void> {
    return await sendPasswordResetEmail(this._auth, model.correo);
  }

  //si hay un usuario loggueado va a devolver un true y si no un false
  //la promesa va a devolver el boolean
  async isUserLoggued(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._auth.onAuthStateChanged((user: User | null) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  //metodo GET para obtener el usuario logueado actual
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

  //para obtener el UID de firebase a travez de getCurrentUser()
  async getCurrentUserId(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.uid ?? null;
  }

  //metodo GET para obtener usuario por el UID del documento
  async getUserByID(): Promise<registerDto | null> {
    try {
      const user = await this.getCurrentUser(); //la constante user toma el valor del usuario loggueado actual
      //docRef es igual al metodo doc() que tiene los datos de _firestore, la ruta PATH y el usuario.uid
      //si no existe toma valor vacio
      const docRef = doc(this._firestore, PATH, user?.uid ?? '');
      const userSnapshot = await getDoc(docRef); //userSnapshot es igual al metodo getDoc() que recibe los datos de docRef
      //si el usuario existe retorna sus datos alojados en firestore
      if (userSnapshot.exists()) {
        return userSnapshot.data() as registerDto;
      }
      //sino, que sea nulo
      return null;
    } catch (error) {
      //si da error, enviamos mensaje de error
      throw new Error('El Usuario no existe.');
    }
  }

  //metodo GET para obtener usuario por Query
  async getUserByQuery(): Promise<registerDto | null> {
    const user = await this.getCurrentUser();
    const userQuery = query(
      //userQuery toma los datos de una funcion query con el valor de la coleccion usuarios que tengan uid, se puede usar mas de un where
      this._collection,
      where('uid', '==', user?.uid),
      where('isActive', '==', true),
      //orderBy('nombres', 'desc'),//metodo para ordenar de forma  descendente
      orderBy('nombres', 'asc') //metodo para ordenar de forma ascendente
    );
    const userSnapshot = await getDocs(userQuery); //userSnapshot optiene el valor de los usuarios con uid
    if (userSnapshot.empty) {
      return null; //si esta vacio, datos vacios
    }
    return userSnapshot.docs[0].data() as registerDto; //si el userSnapshot es contrario de vacio, retornara el primer valor del arreglo.
  }

  //metodo para actualizar un usuario en Firestore
  async updateUser(user: registerDto): Promise<void> {
    if (!user.uid) throw new Error('UID del usuario no existe');
    const docRef = doc(this._collection, user.uid);
    await updateDoc(docRef, {
      ...{
        //los tres puntos le dicen a Firestore que actualice unicamente los datos enviados, no toda la coleccion.
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        dni: user.dni,
        telefono: user.telefono,
        imageProfile: user.imageProfile, //para actualizar foto de perfil
        birthDate: user.birthDate,
        deviceID: ''
      },
    });
  }



  //metodo para eliminar usuario
  async deleteUser(id: string): Promise<void> {
    if (!id) throw new Error('El UID del usuario es requerido');

    const docRef = doc(this._collection, id);
    await deleteDoc(docRef);
  }

  async createDevice(userDevice: registerDto): Promise<void> {
    if (!userDevice.uid) throw new Error('UID del usuario no existe');
    const docRef = doc(this._collection, userDevice.uid);
    await updateDoc(docRef,{...{
      deviceID: userDevice.deviceID
    }})
  }
  //final
}
