import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el doctor
export interface Doctor {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  especialidad: {
    _id: string;
    nombre: string;
  };
  telefono?: string;
  precioConsulta?: number;
  activo?: boolean;
}

// Interfaz para la especialidad
export interface Especialidad {
  _id: string;
  nombre: string;
  descripcion?: string; // Opcional, por si no todas tienen descripción
  doctores?: Doctor[]; // Array de doctores que pertenecen a esta especialidad
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/especialidades`;

  registrarEspecialidad(especialidad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, especialidad);
  }

  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }

  getEspecialidadById(id: string): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }
}
