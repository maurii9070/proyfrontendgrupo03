import { inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  authState,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebaseService {
  private auth = inject(Auth);

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      const result = await from(
        signInWithPopup(this.auth, provider)
      ).toPromise();

      if (!result) throw new Error('No se pudo iniciar sesión con Google');

      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await from(signOut(this.auth)).toPromise();
      //this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}
