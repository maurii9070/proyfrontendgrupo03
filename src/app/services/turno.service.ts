import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Especialidad } from './especialidad.service';
import { Observable } from 'rxjs';
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
  precioConsulta: number;

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


@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/turnos`;

  getTurnosByPacienteId(pacienteId: string) {
    return this.http.get<Turno[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }
  getTurnosByDoctorId(doctorId: string) {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`);
  }
  //falta el create turno
  crearTurno(idPaciente: string, idDoctor: string, fecha: string, hora: string, observaciones: string): Observable<any> {
    const body = { fecha, hora, observaciones };
    return this.http.post(`${this.apiUrl}/paciente/${idPaciente}/doctor/${idDoctor}`, body);
  }
  //update turno observaciones solo

  getTurnoById(turnoId: string) {
    return this.http.get(`${this.apiUrl}/${turnoId}`);
  }

  cancelarTurno(turnoId: string) {
    return this.http.put(`${this.apiUrl}/${turnoId}/cancelado`, {});
  }
  realizarTurno(turnoId: string, token: string) {
    return this.http.put(
      `${this.apiUrl}/${turnoId}/realizado`,
      {}, // body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  getAllTurnos() {
    return this.http.get<Turno[]>(this.apiUrl);
  }
  getTurnosByFecha(fecha: string) {
    return this.http.get<Turno[]>(`${this.apiUrl}/fecha`, { params: { fecha: fecha } });
  }
  getTurnosPendientes() {
    return this.http.get<Turno[]>(`${this.apiUrl}/estado/pendiente`);
  }
  getTurnosByEstado(estado: string,idPaciente:string) {
    return this.http.get<Turno[]>(`${this.apiUrl}/estado/${estado}/paciente/${idPaciente}`);
  }
  confirmarTurno(turnoId: string, token: string) {
    return this.http.put(`${this.apiUrl}/${turnoId}/confirmado`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  actualizarDetallesTurno(turnoId: string, turno: any) {
    return this.http.put(`${this.apiUrl}/${turnoId}`, turno);
  }
  getTurnosByDoctorFecha(doctorId: string, fecha: string) {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}/fecha`, {
      params: {
        fecha: fecha,
      },
    });
  }
}
