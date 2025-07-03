import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
export interface Especialidad{
  _id: string;
  nombre: string;
}
export interface Doctor {
  _id: string;
  nombre: string;
  apellido: string;
  especialidad: Especialidad;
  precioConsulta: number;
  telefono: string;
}
@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  http= inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/doctores`;

  registrarDoctor(doctor: any) {
    return this.http.post(this.apiUrl, doctor);
  }
  
  getDoctores() {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctoresByName(nombre: string) {
    return this.http.get<Doctor[]>(`${this.apiUrl}/name?nombre=${nombre}`);
  } 
  getDoctoresByEspecialidad(idEspecialidad: string) {
    return this.http.get<Doctor[]>(`${this.apiUrl}/especialidad/${idEspecialidad}`);
  }
}
