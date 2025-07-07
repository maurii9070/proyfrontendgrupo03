import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../services/autenticacion.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetear-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resetear-password.component.html',
})
export class ResetearPasswordComponent {
  private fb = inject(FormBuilder);

  private autenticacionService = inject(AutenticacionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  resetPasswordForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor() {
    this.resetPasswordForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getters para facilitar el acceso a los controles
  get dni() {
    return this.resetPasswordForm.get('dni');
  }

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;

      const { dni, newPassword } = this.resetPasswordForm.value;

      this.autenticacionService.resetPassword(dni, newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.showSuccess('Contraseña restablecida con éxito');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.toastService.showError('DNI no encontrado');
          } else {
            this.toastService.showError('Error al restablecer la contraseña');
          }
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
