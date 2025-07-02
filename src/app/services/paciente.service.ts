import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pacientes`;

  registrarPaciente(paciente: any) {
    return this.http.post(`${this.apiUrl}/registro`, paciente);
  }

  getPacienteById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
