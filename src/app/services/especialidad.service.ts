import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Especialidad{
  _id: string;
  nombre: string;
  descripcion: string;
}
@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  http=inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/especialidades`;

  getEspecialidades() {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }
  getEspecialidadById(id: string) {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }

}

