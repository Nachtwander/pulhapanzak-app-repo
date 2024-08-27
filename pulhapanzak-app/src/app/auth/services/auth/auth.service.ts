import { inject, Injectable } from '@angular/core';
// importamos lo necesario para la autenticacion
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { loginDto } from '../../models/login.dto';
import { registerDto } from '../../models/register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //creamos variable _auth de tipo Auth donde se le injecto Auth de angular fire para autentificar usuario.
  private _auth: Auth = inject(Auth);

  constructor() {}

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
      model.password,
    );
  }

  //metodo asincronico para cerrar sesion
  async singOut(): Promise<void> {
    return await this._auth.signOut();
  }
}
