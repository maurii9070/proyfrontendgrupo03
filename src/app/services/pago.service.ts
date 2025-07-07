import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Turno } from './turno.service';

export interface Pago {
  monto: number;
  metodoPago: 'mercadoPago' | 'efectivo' | 'transferencia';
  turno: string;
}

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = environment.apiUrl + '/pagos';
  private http = inject(HttpClient);

  crearNuevoPago(pago: Pago) {
    return this.http.post<Pago>(this.apiUrl, pago);
  }
}
