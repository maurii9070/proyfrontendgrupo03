import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  http= inject(HttpClient);
  private apiUrl = 'http://localhost:4000/api/pacientes/:idPaciente';

  getPacienteById(idPaciente: string) {
    const url = this.apiUrl.replace(':idPaciente', idPaciente);
    return this.http.get(url);
  }
}
