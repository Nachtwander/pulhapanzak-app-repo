import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  //injectamos AuthService de services/auth/auth.service.ts
  //en esta variable ahora estan los metodos creados en AuthService
  private _authService: AuthService = inject(AuthService);

  //injectamos el Router de Angular
  //lo vamos a utilizar en la verificacion si el usuario no esta logged, lo vamos a mandar al login.
  private _router: Router = inject(Router);

  // Metodo que verificara si el usuario esta loggueadp
  async canActivate(): Promise<boolean> {
    //varieble que usara el metodo isUserLoggued de auth.service.ts
    const isUserLoggued: boolean = await this._authService.isUserLoggued();
    // si isUserLoggued es distinto de true lo enviara a la pantalla login
    if (!isUserLoggued) {
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }

  //final
}
