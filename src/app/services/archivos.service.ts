import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl + '/archivos';

  subirArchivoMedico(url: string, idTurno: string, nombre: string) {
    return this.http.post<any>(`${this.baseUrl}/${idTurno}`, {
      tipo: 'medico',
      url,
      nombre,
    });
  }
  subirArchivoPago(url: string, idTurno: string, nombre: string) {
    return this.http.post<any>(`${this.baseUrl}/${idTurno}`, {
      tipo: 'pago',
      url,
      nombre,
    });
  }
}
