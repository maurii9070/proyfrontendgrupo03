import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { AutenticacionService } from '../../services/autenticacion.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

export interface Paciente{
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  fechjaNacimiento?: string;
  telefono?: string;
}
@Component({
  selector: 'app-main-paciente',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './main-paciente.component.html',
  styleUrls: ['./main-paciente.component.css']
})
export class MainPacienteComponent implements OnInit {
  pacienteId: string = '';
  pacienteService = inject(PacienteService);
  route = inject(ActivatedRoute);
  paciente: Paciente = {
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    fechjaNacimiento: '',
    telefono: ''
  };
  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('idPaciente') || '';
    this.pacienteService.getPacienteById(this.pacienteId).subscribe((data: any) => {
      this.paciente = data;
    }, error => {
      console.error('Error al obtener los datos del paciente:', error);
    });
  }


  turnos: any[] = [
    {
      especialidad: 'Cardiología',
      doctor: 'Dr. García',
      fecha: '2025-07-10',
      hora: '10:00',
      estado: 'pendiente',
      observaciones: 'Traer estudios previos.'
    },
    {
      especialidad: 'Neurología',
      doctor: 'Dra. López',
      fecha: '2025-07-15',
      hora: '14:30',
      estado: 'confirmado',
      observaciones: ''
    },
    {
      especialidad: 'Clínica',
      doctor: 'Dr. Suárez',
      fecha: '2025-06-20',
      hora: '09:00',
      estado: 'cancelado',
      observaciones: 'Cancelado por el paciente.'
    }
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  get tieneTurnos(): boolean {
    return this.turnos.length > 0;
  }
}

