import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
export interface Especialidad {
  _id: string;
  nombre: string;
}
export interface Doctor {
  _id: string;
  nombre: string;
  apellido: string;
  especialidad: Especialidad;
  telefono: string;
  email: string;
  precioConsulta: number;
  activo: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/doctores`;

  registrarDoctor(doctor: any, token: string) {
    return this.http.post(this.apiUrl, doctor, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getDoctores() {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctoresByName(nombre: string) {
    return this.http.get<Doctor[]>(`${this.apiUrl}/name?nombre=${nombre}`);
  }
  getDoctoresByEspecialidad(idEspecialidad: string) {
    return this.http.get<Doctor[]>(
      `${this.apiUrl}/especialidad/${idEspecialidad}`
    );
  }
  desactivarDoctor(id: string, token: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getDoctorById(id: string) {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  actualizarDoctor(id: string, doctor: any, token: string) {
    return this.http.put(`${this.apiUrl}/${id}`, doctor, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
