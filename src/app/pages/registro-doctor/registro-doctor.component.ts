import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { Doctor } from '../../models/doctor.model';
import { Especialidad } from '../../models/especialidad.model';

@Component({
  selector: 'app-registro-doctor',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-doctor.component.html',
  styleUrl: './registro-doctor.component.css'
})
export class RegistroDoctorComponent implements OnInit {
  // Objeto para el formulario de registro (sin _id)
  doctorForm: Omit<Doctor, '_id'> = {
    dni: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '', 
    rol: "doctor",
    telefono: '',
    matricula: '',
    especialidad: '',
    precioConsulta: 0,
    activo: true
  };

  // Propiedad separada para manejar el ID de la especialidad en el select
  especialidadId: string = '';

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

  cargarEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe({
      next: (especialidades: Especialidad[]) => {
        this.especialidades = especialidades;
      },
      error: (err) => {
        this.error = 'Error al cargar especialidades: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  registrarDoctor(): void {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    // Buscar la especialidad seleccionada
    const especialidadSeleccionada = this.especialidades.find(esp => esp._id === this.especialidadId);
    
    if (!especialidadSeleccionada) {
      this.error = 'Debe seleccionar una especialidad válida';
      this.cargando = false;
      return;
    }

    // Actualizar la especialidad con el objeto completo
    const doctorData: Omit<Doctor, '_id'> = {
      ...this.doctorForm,
      especialidad: especialidadSeleccionada._id,
      precioConsulta: Number(this.doctorForm.precioConsulta)
    };

    this.doctorService.registrarDoctor(doctorData).subscribe({
      next: (response) => {
        this.mensaje = 'Doctor registrado exitosamente';
        this.cargando = false;
        this.limpiarFormulario();
      },
      error: (err) => {
        this.error = 'Error al registrar el doctor: ' + (err.error?.message || err.message || 'Error desconocido');
        this.cargando = false;
      }
    });
  }

  private limpiarFormulario(): void {
    this.doctorForm = {
      dni: '',
      email: '',
      password: '',
      nombre: '',
      apellido: '', 
      rol: "doctor",
      telefono: '',
      matricula: '',
      especialidad: '',
      precioConsulta: 0,
      activo: true
    };
    this.especialidadId = '';
  }
}
