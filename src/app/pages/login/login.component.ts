import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AutenticacionService,
  UserProfile,
} from '../../services/autenticacion.service';
import { ToastService } from '../../services/toast.service';
import { AuthFirebaseService } from '../../services/auth-firebase.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
  private autenticacionFirebaseService = inject(AuthFirebaseService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const loginData = {
        dni: this.loginForm.get('dni')?.value,
        password: this.loginForm.get('password')?.value,
      };

      this.autenticacionService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Guardar token
          this.autenticacionService.setToken(response.token);
          // Mostrar toast de éxito
          //this.toastService.showSuccess('Inicio de sesión exitoso');
          // Obtener perfil del usuario autenticado
          this.autenticacionService.getPerfilUsuario().subscribe({
            next: (perfil) => {
              // Verificar que el perfil no sea null
              if (!perfil) {
                this.toastService.showError(
                  'No se pudo obtener el perfil del usuario.'
                );
                return;
              }

              // Mostrar toast de éxito
              this.toastService.showSuccess('Inicio de sesión exitoso');
              // Redirigir según el rol
              if (perfil._rol === 'Paciente') {
                this.router.navigate(['/paciente/', perfil._id]);
              } else if (perfil._rol === 'Doctor') {
                this.router.navigate(['/doctor/', perfil._id]);
              } else if (
                perfil._rol === 'admin' ||
                perfil._rol === 'Administrador'
              ) {
                this.router.navigate(['/admin/']);
              } else {
                this.toastService.showError('Rol no reconocido.');
              }
            },
            error: (error) => {
              this.toastService.showError('No se pudo obtener el perfil.');
            },
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);

          // Mostrar toast de error
          const errorMessage =
            error.error?.msg || 'Error de conexión. Intenta nuevamente.';
          this.toastService.showError(errorMessage);
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }

  get dni() {
    return this.loginForm.get('dni');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onCreateAccount() {
    // Navegación a página de registro
    this.router.navigate(['/login/registro-paciente']);
    console.log('Navegando a crear cuenta...');
  }

  async onGoogleLogin() {
    try {
      const result = await this.autenticacionFirebaseService.loginWithGoogle();
      const token = await result.user.getIdToken();

      this.autenticacionFirebaseService
        .verificarUsuarioEnBackend(token)
        .subscribe({
          next: (response) => {
            // Manejar la respuesta del backend
            if (response.dniConfirmado === false) {
              // Enviar todos los datos necesarios al componente de solicitud DNI
              this.router.navigate(['/login/solicitud-dni'], {
                state: {
                  userData: response,
                  token: token,
                  googleUser: {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid,
                  },
                },
              });
            } else {
              // Usuario ya verificado, establecer token y redirigir
              this.autenticacionService.setToken(response.token);

              // Esperar a que el perfil se cargue automáticamente
              this.autenticacionService.currentUserProfile$
                .pipe(
                  filter((perfil: UserProfile | null) => perfil !== null), // Esperar hasta que el perfil no sea null
                  take(1) // Tomar solo el primer valor válido
                )
                .subscribe({
                  next: (perfil) => {
                    if (perfil) {
                      this.toastService.showSuccess('Inicio de sesión exitoso');
                      this.router.navigate(['/paciente/', perfil._id]);
                    }
                  },
                  error: (error) => {
                    console.error(
                      'Error al obtener perfil del usuario:',
                      error
                    );
                    this.toastService.showError(
                      'No se pudo obtener el perfil del usuario.'
                    );
                  },
                });
            }
          },
          error: (error) => {
            this.toastService.showError(
              'Error al verificar usuario en backend'
            );
          },
        });
    } catch (error) {
      console.log('Error en inicio de sesión con Google:', error);
    }
  }

  onForgotPassword() {
    // Navegación a página de resetear contraseña
    this.router.navigate(['/resetear-password']);
  }
}
