import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EspecialidadService } from '../../services/especialidad.service';
import { DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';

export interface Especialidad{
  _id: string;
  nombre: string;
}
export interface Doctor {
  _id: string;
  nombre: string;
  apellido: string;
  especialidad: Especialidad;
  precioConsulta: number;
  telefono: string;
}
@Component({
  selector: 'app-list-doctores',
  imports: [FormsModule],
  templateUrl: './list-doctores.component.html',
  styleUrl: './list-doctores.component.css'
})

export class ListDoctoresComponent implements OnInit {
  @Input() pacienteId!: string;
  @Input() mostrarBotonTurno: boolean = false; // Controla la visibilidad del botón de solicitar turno
  busquedaNombre: string = '';
  filtroEspecialidad: string = '';

  especialidades: Especialidad[] = []

  doctores: Doctor[] = []
  
  doctorService= inject(DoctorService);
  especialidadService= inject(EspecialidadService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarDoctores();
    this.especialidadService.getEspecialidades().subscribe((especialidades: Especialidad[]) => {
      this.especialidades = especialidades;
    });
  }

  cargarDoctores(nombre: string = '', especialidad: string = '') {
    // Si ambos filtros están vacíos, trae todos
    if (nombre.trim() === '' && especialidad.trim() === '') {
      this.doctorService.getDoctores().subscribe((doctores: Doctor[] | null | undefined) => {
        this.doctores = Array.isArray(doctores) ? doctores : [];
      });
    } else if (nombre.trim() !== '' && especialidad.trim() === '') {
      // Solo filtro por nombre
      this.doctorService.getDoctoresByName(nombre).subscribe((doctores: Doctor[]) => {
        this.doctores = doctores;
        console.log('Doctores filtrados por nombre:', this.doctores);
      });
    } else if (nombre.trim() === '' && especialidad.trim() !== '') {
      // Solo filtro por especialidad
      this.doctorService.getDoctoresByEspecialidad(especialidad).subscribe((doctores: Doctor[] | null | undefined) => {
        this.doctores = Array.isArray(doctores) ? doctores : [];
      });
    } else {
      // Filtro por ambos: primero por nombre, luego filtro por especialidad en el front
      this.doctorService.getDoctoresByName(nombre).subscribe((doctores: Doctor[] | null | undefined) => {
        const lista = Array.isArray(doctores) ? doctores : [];
        this.doctores = lista.filter(doc => doc.especialidad?.nombre === especialidad);
      });
    }
  }

  onClickReservarTurno(idDoctor:string){
    this.router.navigate(['/paciente', this.pacienteId, 'turno', idDoctor]);
  }
  onBuscarNombre() {
    this.cargarDoctores(this.busquedaNombre, this.filtroEspecialidad);
  }

  onFiltrarEspecialidad() {
    this.cargarDoctores(this.busquedaNombre, this.filtroEspecialidad);
  }

  doctoresFiltrados() {
    // Ya no es necesario filtrar aquí, porque se filtra en el backend o en cargarDoctores
    return this.doctores;
  }
}
