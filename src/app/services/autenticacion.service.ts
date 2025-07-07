import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

// Definición de las interfaces para las solicitudes y respuestas de autenticación

// interface para los guards
export interface LoginRequest {
  dni: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// interface para el payload del token JWT (decodificado)
interface DecodeJwtPayload {
  usuario: {
    id: string;
    rol: string; // 'paciente', 'medico', 'administrador'
  };
  exp: number; // Fecha de expiración del token
  iat: number; // Fecha de emisión del token
}

// interface para el perfil del usuario
export interface UserProfile {
  _id: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
  _rol: string; // 'paciente', 'medico', 'administrador'
}

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';

  // usamos BehaviorSubject para manejar el estado de autenticación
  private _isLoggedIn = new BehaviorSubject<boolean>(this.checkTokenValidity());
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  //BehaviorSubject para el perfil del usuario
  private _currentUserProfile = new BehaviorSubject<UserProfile | null>(null);
  public currentUserProfile$ = this._currentUserProfile.asObservable();

  //contructor: Intenta cargar el perfil del usuario al iniciar el servicio si hay un token
  constructor() {
    console.log('AutenticacionService iniciado');
    if (this.isLoggedIn()) {
      console.log('Usuario ya autenticado, cargando perfil...');
      this.loadUserProfile();
    } else {
      console.log('Usuario no autenticado');
    }
  }

  // login(credentials: LoginRequest): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  // }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this._isLoggedIn.next(true);
          this.loadUserProfile();
        }),
        catchError((error) => {
          console.error('Error de inicio de sesión:', error);
          this._isLoggedIn.next(false); // Asegurarse de que el estado sea falso si falla el login
          return of(error); // Devolver un observable de error para que el componente lo maneje
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this._isLoggedIn.next(true);
    this.loadUserProfile(); // Cargar el perfil automáticamente cuando se establece un token
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.next(false);
    this._currentUserProfile.next(null); // Limpiar el perfil del usuario
    console.log('Usuario deslogueado - Estado limpiado');
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.getValue();
  }

  //verificar si hay un token valido (no solo si existe, sino si es valido)
  private checkTokenValidity(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decodedToken: DecodeJwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convertir a segundos
      // Verificar si el token no ha expirado
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.warn('Token expirado');
        this.logout(); // Si el token ha expirado, lo eliminamos y actualizamos el estado
        return false;
      }
      return true; // Si el token es válido, retornamos true
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.logout(); // Si hay un error al decodificar, eliminamos el token y actualizamos el estado
      return false;
    }
  }

  // Cargar el perfil del usuario desde el backend
  private loadUserProfile(): void {
    console.log('Cargando perfil de usuario...');
    this.getPerfilUsuario().subscribe({
      next: (profile: UserProfile | null) => {
        console.log('Perfil cargado:', profile);
        this._currentUserProfile.next(profile);
      },
      error: (error) => {
        console.error('Error al cargar el perfil del usuario:', error);
        this._currentUserProfile.next(null); // Si hay un error, limpiar el perfil
        this.logout(); // Opcional: cerrar sesión si no se puede cargar el perfil
      },
    });
  }

  getPerfilUsuario(): Observable<UserProfile | null> {
    const token = this.getToken();
    if (!token) {
      console.warn(
        'No hay token disponible para obtener el perfil del usuario'
      );
      return of(null);
    }
    return this.http
      .get<UserProfile>(`${this.apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((error) => {
          console.error('API /auth/me error', error);
          return of(null); // Devolver null en caso de error
        })
      );
  }

  //Metodo para verificar si el usuario tiene un rol específico
  hasRole(requiredRole: string): boolean {
    const profile = this._currentUserProfile.getValue();
    // del backend viene "_rol" por eso usamos "profile?._rol"
    return !!(profile && profile._rol === requiredRole);
  }

  // Si necesitas chequear múltiples roles (ej: 'admin' O 'medico')
  hasAnyRole(requiredRoles: string[]): boolean {
    const profile = this._currentUserProfile.getValue();
    if (!profile || !profile._rol) {
      return false;
    }
    return requiredRoles.includes(profile._rol);
  }

  resetPassword(dni: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      dni,
      newPassword,
    });
  }

  // Método público para forzar la recarga del perfil (útil después de problemas de estado)
  public forceReloadUserProfile(): void {
    if (this.isLoggedIn()) {
      this.loadUserProfile();
    } else {
      this._currentUserProfile.next(null);
    }
  }
}
