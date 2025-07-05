import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  private apiUrl = `${environment.apiUrl}/mercadoPago`;
  private http= inject(HttpClient);
  ///crear-preferencia/:idDoctor
  crearPreferencia(idDoctor:string, idTurno:string){
    return this.http.post<{ init_point: string }>(`${this.apiUrl}/crear-preferencia/${idDoctor}/turno/${idTurno}`,{});
  }
}
