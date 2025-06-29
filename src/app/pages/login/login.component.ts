import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
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
              // Mostrar toast de éxito
              this.toastService.showSuccess('Inicio de sesión exitoso');
              // Redirigir según el rol
              if (perfil._rol === 'Paciente') {
                this.router.navigate(['/paciente/', perfil._id]);
              } else if (perfil._rol === 'Doctor') {
                this.router.navigate(['/doctor/', perfil._id]);
              } else if (
                perfil._rol === 'Admin' ||
                perfil._rol === 'Administrador'
              ) {
                this.router.navigate(['/admin/', perfil._id]);
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
            error.error?.message || 'Error de conexión. Intenta nuevamente.';
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
    console.log('Navegando a crear cuenta...');
  }

  onGoogleLogin() {
    // Lógica para login con Google
    console.log('Iniciando sesión con Google...');
    // Aquí iría la integración con Google OAuth
  }

  onForgotPassword() {
    // Lógica para recuperar contraseña
    console.log('Recuperar contraseña...');
  }
}
