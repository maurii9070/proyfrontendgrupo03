import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EstadisticasGenerales {
  totalTurnos: number;
  turnosPendientes: number;
  turnosRealizados: number;
  turnosCancelados: number;
  totalDoctores: number;
  totalEspecialidades: number;
  porcentajeRealizados: string;
}

export interface TopItem {
  _id: string;
  cantidad: number;
}

export interface ResumenEstadisticas {
  estadisticasGenerales: EstadisticasGenerales;
  topEspecialidades: TopItem[];
  topHorarios: TopItem[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface EstadisticaResponse<T = any> {
  raw: T[];
  chartData: ChartData;
  total?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private apiUrl = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Resumen general
  getResumen(): Observable<ResumenEstadisticas> {
    return this.http.get<ResumenEstadisticas>(`${this.apiUrl}/resumen`, {
      headers: this.getHeaders(),
    });
  }

  // Turnos por especialidad
  getTurnosPorEspecialidad(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/turnos-por-especialidad`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Horarios más solicitados
  getHorariosMasSolicitados(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/horarios-mas-solicitados`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Turnos por doctor
  getTurnosPorDoctor(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/turnos-por-doctor`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Turnos por mes
  getTurnosPorMes(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(`${this.apiUrl}/turnos-por-mes`, {
      headers: this.getHeaders(),
    });
  }

  // Estados de turnos
  getEstadosTurnos(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(`${this.apiUrl}/estados-turnos`, {
      headers: this.getHeaders(),
    });
  }

  // Ingresos por especialidad
  getIngresosPorEspecialidad(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/ingresos-por-especialidad`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Nuevas estadísticas

  // Turnos por día de la semana
  getTurnosPorDiaSemana(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/turnos-por-dia-semana`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Ingresos por mes
  getIngresosPorMes(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/ingresos-por-mes`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Top doctores más solicitados
  getTopDoctoresSolicitados(): Observable<EstadisticaResponse> {
    return this.http.get<EstadisticaResponse>(
      `${this.apiUrl}/top-doctores-solicitados`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
