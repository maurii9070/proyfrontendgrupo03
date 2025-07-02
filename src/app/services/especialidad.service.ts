import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  http=inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/especialidades`;

  getEspecialidades() {
    return this.http.get<any[]>(this.apiUrl);
  }
  getEspecialidadById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}
