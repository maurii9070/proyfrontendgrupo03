import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  http= inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/doctores`;

  getDoctores() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDoctoresByName(nombre: string) {
    return this.http.get<any[]>(`${this.apiUrl}/name?nombre=${nombre}`);
  } 
  getDoctoresByEspecialidad(idEspecialidad: string) {
    return this.http.get<any[]>(`${this.apiUrl}/especialidad/${idEspecialidad}`);
  }
}
