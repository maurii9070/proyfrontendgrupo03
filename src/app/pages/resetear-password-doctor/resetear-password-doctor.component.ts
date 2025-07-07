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
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resetear-password-doctor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resetear-password-doctor.component.html',
})
export class ResetearPasswordDoctorComponent {
  private fb = inject(FormBuilder);

  private autenticacionService = inject(AutenticacionService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  resetPasswordForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showRepeatPassword = false;
  submitted = false;

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Getters para facilitar el acceso a los controles
  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get repeatPassword() {
    return this.resetPasswordForm.get('repeatPassword');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPasswordVisibility() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const repeat = form.get('repeatPassword')?.value;
    return password === repeat ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      let dni: string = '';
      dni = this.route.snapshot.paramMap.get('dni') || '';
      const { newPassword } = this.resetPasswordForm.value;
      if (!dni) {
        this.toastService.showError(
          'No se pudo obtener el identificador del doctor.'
        );
        this.isLoading = false;
        return;
      }
      this.autenticacionService.resetPassword(dni, newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.showSuccess(
            'Contraseña restablecida con éxito. Por favor, inicia sesión nuevamente.'
          );
          this.autenticacionService.logout(); // Cerrar sesión
          this.router.navigate(['/login']); // Redirigir al login
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.showError('Error al restablecer la contraseña');
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  goBack() {
    this.location.back();
  }
}
