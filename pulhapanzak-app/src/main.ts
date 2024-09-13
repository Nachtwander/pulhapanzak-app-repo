import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()), //injectar proveedor HttpClientn 25:29 min
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'pulhapanzak-app',
        appId: '1:435698089790:web:cd3b657b133185bcae766f',
        storageBucket: 'pulhapanzak-app.appspot.com',
        apiKey: 'AIzaSyCrESF2jL38EM-fuGRZggl1rFS0AWrs7pk',
        authDomain: 'pulhapanzak-app.firebaseapp.com',
        messagingSenderId: '435698089790',
        measurementId: 'G-ZJ5S0SXRNZ',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
  ],
});
