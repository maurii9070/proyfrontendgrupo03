import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { EspecialidadesService, Especialidad } from '../../services/especialidades.service';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

// Interfaz para agrupar doctores por especialidad
interface EspecialidadConDoctores {
  _id: string;
  nombre: string;
  descripcion?: string; // Opcional, para futuras implementaciones
  doctores: Doctor[];
}

@Component({
  selector: 'app-especialidades',
  imports: [CommonModule, RouterLink],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent implements OnInit {
  
  especialidades: EspecialidadConDoctores[] = [];
  cargando = false;
  error = '';

  constructor(
    private doctorService: DoctorService,
    private especialidadesService: EspecialidadesService
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidadesConDoctores();
  }

  cargarEspecialidadesConDoctores(): void {
    this.cargando = true;
    this.error = '';
    
    // Obtener tanto doctores como especialidades en paralelo
    forkJoin({
      doctores: this.doctorService.getDoctores(),
      especialidades: this.especialidadesService.getEspecialidades()
    }).subscribe({
      next: ({ doctores, especialidades }) => {
        this.especialidades = this.agruparPorEspecialidad(doctores, especialidades);
        this.cargando = false;
        console.log('Especialidades con doctores:', this.especialidades);
      },
      error: (err) => {
        this.error = 'Error al cargar las especialidades y doctores';
        this.cargando = false;
        console.error('Error al cargar especialidades:', err);
      }
    });
  }

  // Método para agrupar doctores por especialidad
  private agruparPorEspecialidad(doctores: Doctor[], especialidades: Especialidad[]): EspecialidadConDoctores[] {
    const especialidadesMap = new Map<string, EspecialidadConDoctores>();

    // Crear un mapa de especialidades para acceso rápido a las descripciones
    const especialidadesInfo = new Map<string, Especialidad>();
    especialidades.forEach(esp => {
      especialidadesInfo.set(esp._id, esp);
    });

    doctores.forEach(doctor => {
      const especialidadId = doctor.especialidad._id;
      const especialidadNombre = doctor.especialidad.nombre;
      const especialidadInfo = especialidadesInfo.get(especialidadId);

      if (!especialidadesMap.has(especialidadId)) {
        especialidadesMap.set(especialidadId, {
          _id: especialidadId,
          nombre: especialidadNombre,
          descripcion: especialidadInfo?.descripcion || 'Especialidad médica profesional',
          doctores: []
        });
      }

      especialidadesMap.get(especialidadId)!.doctores.push(doctor);
    });

    return Array.from(especialidadesMap.values()).sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );
  }

  // Método para refrescar la lista
  refrescarEspecialidades(): void {
    this.cargarEspecialidadesConDoctores();
  }

  // Método para obtener el nombre completo del doctor
  getNombreCompleto(doctor: Doctor): string {
    return `Dr. ${doctor.nombre} ${doctor.apellido}`;
  }
}
