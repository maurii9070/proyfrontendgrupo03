import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { EspecialidadService } from '../../services/especialidad.service';

interface Especialidad {
  _id: string;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-registro-doctor',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-doctor.component.html',
  styleUrl: './registro-doctor.component.css'
})
export class RegistroDoctorComponent implements OnInit {
  doctor = {
    dni: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '', 
    rol: "doctor",
    telefono: '',
    matricula: '',
    especialidad: '',
    precioConsulta: '',
    activo: true
  };

  especialidades: Especialidad[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  constructor(
    private doctorService: DoctorService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: (especialidades: Especialidad[]) => {
        this.especialidades = especialidades;
      },
      error: (err) => {
        this.error = 'Error al cargar especialidades: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  registrarDoctor() {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    this.doctorService.registrarDoctor(this.doctor).subscribe({
      next: (response) => {
        this.mensaje = 'Doctor registrado exitosamente';
        this.cargando = false;
        // Limpiar el formulario después del registro exitoso
        this.doctor = {
          dni: '',
          email: '',
          password: '',
          nombre: '',
          apellido: '', 
          rol: "doctor",
          telefono: '',
          matricula: '',
          especialidad: '',
          precioConsulta: '',
          activo: true
        };
      },
      error: (err) => {
        this.error = 'Error al registrar el doctor: ' + (err.error?.message || err.message || 'Error desconocido');
        this.cargando = false;
      }
    });
  }
}