import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../../services/doctor.service';

// Interfaz para agrupar doctores por especialidad
interface EspecialidadConDoctores {
  _id: string;
  nombre: string;
  doctores: Doctor[];
}

@Component({
  selector: 'app-especialidades',
  imports: [CommonModule],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent implements OnInit {
  
  especialidades: EspecialidadConDoctores[] = [];
  cargando = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.cargarEspecialidadesConDoctores();
  }

  cargarEspecialidadesConDoctores(): void {
    this.cargando = true;
    this.error = '';
    
    this.doctorService.getDoctores().subscribe({
      next: (doctores: Doctor[]) => {
        this.especialidades = this.agruparPorEspecialidad(doctores);
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
  private agruparPorEspecialidad(doctores: Doctor[]): EspecialidadConDoctores[] {
    const especialidadesMap = new Map<string, EspecialidadConDoctores>();

    doctores.forEach(doctor => {
      const especialidadId = doctor.especialidad._id;
      const especialidadNombre = doctor.especialidad.nombre;

      if (!especialidadesMap.has(especialidadId)) {
        especialidadesMap.set(especialidadId, {
          _id: especialidadId,
          nombre: especialidadNombre,
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
