import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { AutenticacionService } from '../../services/autenticacion.service';
import { ToastService } from '../../services/toast.service';

interface Especialidad {
  _id: string;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-registro-doctor',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-doctor.component.html',
  styleUrl: './registro-doctor.component.css',
})
export class RegistroDoctorComponent implements OnInit {
  doctor = {
    dni: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rol: 'doctor',
    telefono: '',
    matricula: '',
    especialidad: '',
    precioConsulta: 0,
    activo: true,
  };

  especialidades: Especialidad[] = [];
  cargando = false;
  mensaje = '';
  error = '';
  token: string = '';

  constructor(
    private doctorService: DoctorService,
    private especialidadService: EspecialidadService,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.token = this.autenticacionService.getToken()!;
  }

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: (especialidades: Especialidad[]) => {
        this.especialidades = especialidades;
      },
      error: (err) => {
        this.error =
          'Error al cargar especialidades: ' +
          (err.error?.message || err.message || 'Error desconocido');
      },
    });
  }

  registrarDoctor(): void {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    this.doctorService.registrarDoctor(this.doctor, this.token).subscribe({
      next: (response) => {
        this.mensaje =
          'Doctor registrado exitosamente. Redirigiendo al login...';
        this.cargando = false;
        const payload = {
          ...this.doctor,
          especialidadId: this.doctor.especialidad, // Enviamos solo el ID
        };

        delete (payload as any).especialidad; // Opcional: limpiamos el campo que no espera el backend
        // Limpiar el formulario después del registro exitoso
        this.limpiarFormulario();

        // Mostrar mensaje de éxito
        this.toastService.showSuccess(
          'Doctor registrado exitosamente',
          'Registro Exitoso'
        );
        
        // Redirigir al administrador
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.error =
          'Error al registrar el doctor: ' +
          (err.error?.message || err.message || 'Error desconocido');
        this.cargando = false;
      },
    });
  }

  private limpiarFormulario(): void {
    this.doctor = {
      dni: '',
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      rol: 'doctor',
      telefono: '',
      matricula: '',
      especialidad: '',
      precioConsulta: 0,
      activo: true,
    };
  }
}
