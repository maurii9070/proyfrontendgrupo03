import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/turnos`;

  getTurnosByPacienteId(pacienteId: string) {
    return this.http.get(`${this.apiUrl}/paciente/${pacienteId}`);
  }
  getTurnosByDoctorId(doctorId: string) {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`);
  }
  //falta el create turno

  //update turno observaciones solo

  getTurnoById(turnoId: string) {
    return this.http.get(`${this.apiUrl}/${turnoId}`);
  }

  cancelarTurno(turnoId: string) {
    return this.http.put(`${this.apiUrl}/${turnoId}/cancelado`, {});
  }
  realizarTurno(turnoId: string) {
    return this.http.put(`${this.apiUrl}/${turnoId}/realiado`, {});
  }

  getTurnosByDoctorFecha(doctorId: string, fecha: string) {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}/fecha`, {
      params: {
        fecha: fecha,
      },
    });
  }
}
