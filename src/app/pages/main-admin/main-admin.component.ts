import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Archivo,
  Paciente,
  Turno,
  TurnoService,
} from '../../services/turno.service';
import { PacienteService } from '../../services/paciente.service';
import { Doctor, DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';

@Component({
  selector: 'app-main-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css'],
})
export class MainAdminComponent implements OnInit {
  section = 'turnos';
  dniBusqueda = '';

  filtroFecha: string = '';
  filtroDni = '';
  turnosFiltrados: Turno[] = [];
  showEliminarDoctorModal = false;
  doctorAEliminar: any = null;
  showConfirmPagoModal = false;

  turnoService = inject(TurnoService);
  pacienteService = inject(PacienteService);
  doctorService = inject(DoctorService);
  private router = inject(Router);
  private autenticacionService = inject(AutenticacionService);

  turnos: Turno[] = [];
  pacientes: Paciente[] = [];

  doctores: Doctor[] = [];
  showConfirmModal = false;

  token: string = '';

  ngOnInit() {
    this.token = this.autenticacionService.getToken()!;
    this.turnoService.getAllTurnos().subscribe((turnos: Turno[]) => {
      this.turnosFiltrados = turnos;
    });
    this.turnoService.getTurnosPendientes().subscribe((turnos: Turno[]) => {
      this.turnos = turnos;
    });
    this.pacienteService
      .getAllPacientes(this.token)
      .subscribe((pacientes: Paciente[]) => {
        this.pacientes = pacientes;
      });
    this.doctorService.getDoctores().subscribe((doctores: Doctor[]) => {
      this.doctores = doctores;
    });
  }

  onClickEstadisticas() {
    this.router.navigate(['/estadisticas']);
  }
  onClickRegistrarDoctor() {
    this.router.navigate(['/registro-doctor']); //cambiar a /admin/registro-doctor
  }

  openEliminarDoctorModal(doctor: any) {
    this.doctorAEliminar = doctor;
    this.showEliminarDoctorModal = true;
  }

  confirmarEliminarDoctor() {
    if (!this.doctorAEliminar || !this.doctorAEliminar._id) return;

    this.doctorService
      .desactivarDoctor(this.doctorAEliminar._id, this.token)
      .subscribe({
        next: () => {
          // Actualizar la lista de doctores después de eliminar
          this.doctorService.getDoctores().subscribe((doctores: Doctor[]) => {
            this.doctores = doctores;
            // Si tienes una lista filtrada o mostrada, actualízala aquí también si es necesario
          });
          // Si tienes la referencia al doctor en la lista actual, actualiza su estado localmente
          const idx = this.doctores.findIndex(
            (d) => d._id === this.doctorAEliminar._id
          );
          if (idx !== -1) {
            this.doctores[idx].activo = false;
          }
          this.showEliminarDoctorModal = false;
          this.doctorAEliminar = null;
        },
        error: (err) => {
          console.error('Error al desactivar doctor:', err);
          this.showEliminarDoctorModal = false;
          this.doctorAEliminar = null;
        },
      });
  }

  // Devuelve el primer archivo de tipo 'pago' de un turno, o undefined
  getArchivoPago(turno: Turno): Archivo | null {
    if (!turno.archivos || !Array.isArray(turno.archivos)) return null;
    return turno.archivos.find((a: any) => a.tipo === 'pago') || null;
  }

  onclickConfirmar(idTurno: string, ) {
    this.turnoService.confirmarTurno(idTurno, this.token).subscribe(() => {
      // Actualizar la lista de turnos después de confirmar
      this.turnoService.getTurnosPendientes().subscribe((turnos: Turno[]) => {
        this.turnos = turnos;
        this.filtrarTurnos(); // Refiltrar para actualizar la vista
        this.showConfirmPagoModal = true;
      });
    });
  }

  filtrarTurnos() {
    // Si no hay filtros, mostrar todos los turnos
    if (!this.filtroFecha && !this.filtroDni) {
      this.turnoService.getAllTurnos().subscribe((turnos: Turno[]) => {
        this.turnosFiltrados = turnos;
      });
      return;
    }
    // Si hay ambos filtros, buscar paciente por DNI, luego turnos por id y filtrar por fecha
    if (this.filtroDni && this.filtroFecha) {
      this.pacienteService
        .getPacienteByDni(this.filtroDni)
        .subscribe((paciente: any) => {
          if (paciente && paciente._id) {
            this.turnoService
              .getTurnosByPacienteId(paciente._id)
              .subscribe((turnos: Turno[]) => {
                const fechaFiltro = this.formatearFechaString(
                    this.filtroFecha
                  );
                this.turnosFiltrados = turnos.filter((turno) => {
                  turno.fecha = this.formatearFechaString(turno.fecha);
                  if(this.formatearFechaString(turno.fecha) === fechaFiltro) {
                    return turno;
                  }
                  return false;
                });
              });
          } else {
            this.turnosFiltrados = [];
          }
        });
      return;
    }
    // Si hay solo filtro por DNI
    if (this.filtroDni) {
      this.pacienteService
        .getPacienteByDni(this.filtroDni)
        .subscribe((paciente: any) => {
          if (paciente && paciente._id) {
            this.turnoService
              .getTurnosByPacienteId(paciente._id)
              .subscribe((turnos: Turno[]) => {
                this.turnosFiltrados = turnos;
                console.log(
                  'Turnos filtrados por paciente:',
                  this.turnosFiltrados
                );
              });
          } else {
            this.turnosFiltrados = [];
          }
        });
      return;
    }
    // Si hay solo filtro por fecha
    if (this.filtroFecha) {
      // Filtrado local si la API no soporta el formato deseado
      this.filtroFecha = this.formatearFechaString(this.filtroFecha);
      console.log('Fecha filtro:', this.filtroFecha, typeof this.filtroFecha);
      this.turnoService
        .getTurnosByFecha(this.filtroFecha)
        .subscribe((turnos: Turno[]) => {
          this.turnosFiltrados = turnos;
        });
      return;
    }
  }
  // Convierte una fecha string o Date a formato d/m/yyyy
  formatearFechaString(fecha: string | Date): string {
    if (typeof fecha === 'string') {
      // Normaliza separadores y elimina ceros a la izquierda
      const partes = fecha.replace(/-/g, '/').split(/[\/]/);
      const year = partes[0];
      const month = String(Number(partes[1]));
      const day = String(Number(partes[2]));
      return `${day}/${month}/${year}`;
    } else {
      const d = new Date(fecha);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return `${day}/${month}/${year}`;
    }
  }
  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroDni = '';
    this.filtrarTurnos();
  }
}
