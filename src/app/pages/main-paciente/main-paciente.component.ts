import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { AutenticacionService } from '../../services/autenticacion.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TurnoService } from '../../services/turno.service';
import { ToastService } from '../../services/toast.service';
import { Especialidad } from '../list-doctores/list-doctores.component';
export interface Paciente {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
}
export interface Doctor {
  _id: string;
  nombre: string;
  apellido: string;
  especialidad: Especialidad;
  telefono: string;
  email: string;
}
export interface Archivo {
  _id: string;
  nombre: string;
  url: string;
  tipo: string; // 'comprobante-pago' | 'archivo-medico'
  fechaSubida: string;
}
export interface Turno {
  _id: string;
  fecha: string;
  hora: string;
  paciente: Paciente;
  doctor: Doctor;
  estado: string;
  observaciones: string;
  archivos: Archivo[];
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
  turnoService=inject(TurnoService)
  toastService = inject(ToastService);

  paciente: Paciente = {
    _id: '',
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    fechaNacimiento: '',
    telefono: ''
  };
  turnos: Turno[] = [];
  @ViewChild('modalCancelarTurno') modalCancelarTurno: any;
  turnoIdParaCancelar: string | null = null;
  mostrarModal = false;

  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('idPaciente') || '';
    this.pacienteService.getPacienteById(this.pacienteId).subscribe((data: any) => {
      this.paciente = data;
    }, error => {
      console.error('Error al obtener los datos del paciente:', error);
    });
    this.turnoService.getTurnosByPacienteId(this.pacienteId).subscribe((data: any) => {
      this.turnos = data.sort((a: Turno, b: Turno) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
    }, error => {
      console.error('Error al obtener los turnos del paciente:', error);
    });
  }
  get tieneTurnos(): boolean {
    return this.turnos.length > 0;
  }
  mostrarModalCancelar(turnoId: string) {
    this.turnoIdParaCancelar = turnoId;
    this.mostrarModal = true;
  }

  cerrarModalCancelar() {
    this.mostrarModal = false;
    this.turnoIdParaCancelar = null;
  }

  confirmarCancelarTurno() {
    if (!this.turnoIdParaCancelar) return;
    this.turnoService.cancelarTurno(this.turnoIdParaCancelar).subscribe(() => {
      this.cerrarModalCancelar();
      this.toastService.showSuccess('Turno cancelado exitosamente.');
      // Recargar la página
      window.location.reload();
    }, error => {
      console.error('Error al cancelar el turno:', error);
      this.cerrarModalCancelar();
      this.toastService.showError('No se pudo cancelar el turno. Inténtalo más tarde.');
    });
  }

  onClickSolicitarTurno() {
    // Redirigir a la página de solicitud de turno
    window.location.href = `/doctores`;
  }
}

