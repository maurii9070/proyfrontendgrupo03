import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-registro-paciente',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
})
export class RegistroPacienteComponent {
  paciente = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    email: '',
    password: '',
  };

  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  registrarPaciente(): void {
    this.mensaje = '';
    this.error = '';
    this.cargando = true;
    this.pacienteService.registrarPaciente(this.paciente).subscribe({
      next: (res) => {
        this.mensaje =
          'Paciente registrado exitosamente. Redirigiendo al login...';
        this.paciente = {
          nombre: '',
          apellido: '',
          dni: '',
          telefono: '',
          fechaNacimiento: '',
          email: '',
          password: '',
        };
        this.cargando = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al registrar paciente.';
        this.cargando = false;
      },
    });
  }
}
