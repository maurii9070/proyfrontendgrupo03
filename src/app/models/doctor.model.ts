import { Especialidad } from './especialidad.model';

export interface Doctor {
  _id: string;
  dni: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: string;
  telefono: string;
  matricula: string;
  especialidad: string;
  precioConsulta: number;
  activo: boolean;
} 