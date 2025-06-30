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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebaseService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

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

  verificarUsuarioEnBackend(idToken: string) {
    return this.http.post<any>(`${this.apiUrl}/login/firebase`, { idToken });
  }

  vincularDniAlUsuario(
    dni: string,
    email: string,
    name: string,
    user_id: string
  ) {
    return this.http.post<any>(`${this.apiUrl}/vincular-dni`, {
      user_id,
      dni,
      email,
      name,
    });
  }
}
