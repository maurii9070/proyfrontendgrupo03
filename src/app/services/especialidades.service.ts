import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/especialidades`;

  registrarEspecialidad(especialidad: any) {
    return this.http.post(`${this.apiUrl}`, especialidad);
  }

  getEspecialidades() {
    return this.http.get(this.apiUrl);
  }

  getEspecialidadById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
