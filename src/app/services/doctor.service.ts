import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/doctores`;

  registrarDoctor(doctor: Omit<Doctor, '_id'>): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }
  
  getDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctoresByName(nombre: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/name?nombre=${nombre}`);
  } 
  
  getDoctoresByEspecialidad(idEspecialidad: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/especialidad/${idEspecialidad}`);
  }
  desactivarDoctor(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getDoctorById(id: string) {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }
}
