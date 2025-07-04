import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad.model';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/especialidades`;

  registrarEspecialidad(especialidad: Omit<Especialidad, '_id'>): Observable<Especialidad> {
    return this.http.post<Especialidad>(`${this.apiUrl}`, especialidad);
  }
  
  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }
  
  getEspecialidadById(id: string): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }

}
