import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-registro-paciente',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css'
})
export class RegistroPacienteComponent {
  // Objeto para el formulario de registro (sin _id)
  paciente: Omit<Paciente, '_id'> = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    email: '',
    password: '' 
  };

  mensaje = '';
  error = '';
  cargando = false;

  constructor(private pacienteService: PacienteService) {}

  registrarPaciente(): void {
    this.mensaje = '';
    this.error = '';
    this.cargando = true;
    
    this.pacienteService.registrarPaciente(this.paciente).subscribe({
      next: (res) => {
        this.mensaje = 'Paciente registrado exitosamente.';
        this.limpiarFormulario();
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al registrar paciente.';
        this.cargando = false;
      }
    });
  }

  private limpiarFormulario(): void {
    this.paciente = {
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      fechaNacimiento: '',
      email: '',
      password: ''
    };
  }
}