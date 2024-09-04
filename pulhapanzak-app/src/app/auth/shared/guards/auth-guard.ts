import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Route, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
    //injectamos AuthService de services/auth/auth.service.ts
    //en esta variable ahora estan los metodos creados en AuthService
    private _authService: AuthService = inject(AuthService)

    //injectamos el Router de Angular
    //lo vamos a utilizar en la verificacion si el usuario no esta logged, lo vamos a mandar al login.
    private _router : Router = inject (Router)

    
}
