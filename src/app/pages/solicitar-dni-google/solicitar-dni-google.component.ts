import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthFirebaseService } from '../../services/auth-firebase.service';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-solicitar-dni-google',
  imports: [ReactiveFormsModule],
  templateUrl: './solicitar-dni-google.component.html',
})
export class SolicitarDniGoogleComponent {
  userData: any;

  private fb = inject(FormBuilder);
  private autenticacionFirebaseService = inject(AuthFirebaseService);
  private autenticacionService = inject(AutenticacionService);
  private toastService = inject(ToastService);

  dniForm: FormGroup;
  isLoading = false;

  constructor(private router: Router) {
    this.dniForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.userData = navigation.extras.state['userData'];
    }
  }

  get dni() {
    return this.dniForm.get('dni');
  }

  onSubmit() {
    if (this.dniForm.valid) {
      this.isLoading = true;
      const dni = this.dniForm.get('dni')?.value;
      console.log('DNI ingresado:', dni);
      const { email, name, user_id } = this.userData;

      this.vincularDni(dni, email, name, user_id);
    }
  }

  async vincularDni(dni: string, email: string, name: string, user_id: string) {
    this.autenticacionFirebaseService
      .vincularDniAlUsuario(dni, email, name, user_id)
      .subscribe({
        next: (response) => {
          this.autenticacionService.setToken(response.token);
          this.autenticacionService.getPerfilUsuario().subscribe({
            next: (perfil) => {
              // Verificar que el perfil no sea null
              if (!perfil) {
                this.toastService.showError(
                  'No se pudo obtener el perfil del usuario.'
                );
                return;
              }

              this.toastService.showSuccess('DNI vinculado exitosamente');
              this.router.navigate(['/paciente/', perfil._id]);
            },
            error: (error) => {
              console.error('Error al obtener perfil del usuario:', error);
            },
          });
        },
        error: (error) => {
          this.toastService.showError(error.error.msg, 'Error al vincular DNI');
          this.router.navigate(['/login']);
        },
      });
  }
}
