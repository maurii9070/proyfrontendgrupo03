import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pacientes`;

  registrarPaciente(paciente: Omit<Paciente, '_id'>): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/registro`, paciente);
  }

  getPacienteById(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }
}
