import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import es from '@angular/common/locales/es';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

registerLocaleData(es);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'integral-pysw',
        appId: '1:1017953502504:web:d454eeb11ee905f7903c1d',
        storageBucket: 'integral-pysw.firebasestorage.app',
        apiKey: 'AIzaSyBuha7KC6tp0BDstOGazSMZo549vvCG7WQ',
        authDomain: 'integral-pysw.firebaseapp.com',
        messagingSenderId: '1017953502504',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
