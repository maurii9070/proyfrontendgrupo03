import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para la especialidad
export interface Especialidad {
  _id: string;
  nombre: string;
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
