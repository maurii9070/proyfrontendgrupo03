import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbModal,
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { DoctorService } from '../../services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Archivo, TurnoService } from '../../services/turno.service';
import { FirestoreService } from '../../services/firestore.service';
import { ArchivosService } from '../../services/archivos.service';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';

export interface Especialidad {
  _id: string;
  nombre: string; // Puede ser null si no se ha asignado una especialidad
}

export interface Doctor {
  _id: string;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  _rol: string;
  telefono: string;
  precioConsulta: number;
  especialidad: Especialidad;
  matricula: string;
}

export interface Paciente {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  fechaNacimiento: string;
  telefono: string;
}

export interface Turno {
  _id: string;
  especialidad: string;
  doctor: Doctor;
  paciente: Paciente;
  fecha: string;
  hora: string;
  estado: string;
  observaciones: string;
  archivos: Array<Archivo>;
}

@Component({
  selector: 'app-main-doctor',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './main-doctor.component.html',
  styleUrl: './main-doctor.component.css',
})
export class MainDoctorComponent {
  doctorId: string = '';
  doctorService = inject(DoctorService);
  route = inject(ActivatedRoute);
  turnoService = inject(TurnoService);
  firestoreService = inject(FirestoreService);
  archivosService = inject(ArchivosService);
  toastService = inject(ToastService);
  turnos: Turno[] = [];
  doctor: Doctor | any = {} as Doctor; // Puede ser null si no se ha cargado aún
  turno: Turno = {} as Turno;
  filtroEstado: string = 'todos';
  ordenFecha: 'proxima' | 'lejana' = 'proxima';
  dni: number = 0;
  // Paginación
  paginaActual: number = 1;
  tamanioPagina: number = 5;

  // Edición de observaciones
  editandoObservacion: boolean = false;
  observacionEdit: string = '';
  guardandoObservacion: boolean = false;

  // Subida de archivos
  archivoSeleccionado: File | null = null;
  subiendoArchivo: boolean = false;

  constructor(private modalService: NgbModal, private router: Router) {}

  abrirSubirArchivo() {
    //this.router.navigate(['/subir-archivo']);
  }

  iniciarEdicionObservacion() {
    this.editandoObservacion = true;
    this.observacionEdit = this.turno.observaciones || '';
  }

  cancelarEdicionObservacion() {
    this.editandoObservacion = false;
    this.observacionEdit = this.turno.observaciones || '';
  }

  guardarObservacion() {
    if (!this.turno) return;
    this.guardandoObservacion = true;
    this.turnoService
      .actualizarDetallesTurno(this.turno._id, {
        observaciones: this.observacionEdit,
      })
      .subscribe({
        next: () => {
          this.turno.observaciones = this.observacionEdit;
          this.editandoObservacion = false;
          this.guardandoObservacion = false;
        },
        error: (error) => {
          console.error('Error al actualizar observación:', error);
          this.guardandoObservacion = false;
        },
      });
  }

  ngOnInit(): void {
    //obtener doctor
    this.doctorId = this.route.snapshot.paramMap.get('idDoctor') || '';
    this.doctorService.getDoctorById(this.doctorId).subscribe(
      (data: any) => {
        this.doctor = data;
      },
      (error) => {
        console.error('Error al obtener el doctor:', error);
      }
    );
    //obtener turnos
    this.turnoService.getTurnosByDoctorId(this.doctorId).subscribe(
      (data: any) => {
        this.turnos = data;
      },
      (error) => {
        console.error('Error al obtener los turnos del doctor:', error);
      }
    );
  }

  setFiltroEstado(estado: string) {
    this.filtroEstado = estado;
    this.paginaActual = 1;
  }

  setOrdenFecha(orden: 'proxima' | 'lejana') {
    this.ordenFecha = orden;
    this.paginaActual = 1;
  }

  get turnosFiltrados() {
    let filtrados = this.turnos;
    if (this.filtroEstado !== 'todos') {
      filtrados = filtrados.filter((t) => t.estado === this.filtroEstado);
    }
    if (this.dni && this.dni !== 0) {
      filtrados = filtrados.filter((t) =>
        t.paciente?.dni?.includes(this.dni.toString())
      );
    }
    filtrados = filtrados.slice().sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      if (this.ordenFecha === 'proxima') {
        return fechaA.getTime() - fechaB.getTime();
      } else {
        return fechaB.getTime() - fechaA.getTime();
      }
    });
    return filtrados;
  }

  get totalPaginas(): number {
    return Math.ceil(this.turnosFiltrados.length / this.tamanioPagina) || 1;
  }

  get turnosPaginaActual() {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.turnosFiltrados.slice(inicio, inicio + this.tamanioPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  paginasParaMostrar(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const delta = 2;
    let start = Math.max(1, actual - delta);
    let end = Math.min(total, actual + delta);
    if (actual <= delta) {
      end = Math.min(total, 1 + 2 * delta);
    }
    if (actual + delta > total) {
      start = Math.max(1, total - 2 * delta);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get tieneTurnos(): boolean {
    return this.turnosFiltrados.length > 0;
  }

  //Abrir Modal
  modalModo: 'realizado' | 'cancelar' | null = null;
  abrirModal(
    content: any,
    turnoModal: Turno,
    size: string,
    modo: 'realizado' | 'cancelar'
  ): void {
    this.turno = turnoModal;
    this.modalModo = modo;
    this.modalService.open(content, { size: size, backdrop: 'static' });
  }

  //Cancelar Turno
  confirmarCancelarTurno() {
    if (!this.turno) return;
    this.turnoService.cancelarTurno(this.turno._id).subscribe(
      () => {
        // Recargar la página
        window.location.reload();
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error al cancelar el turno:', error);
      }
    );
  }

  //Confirmar Turno
  confirmarRealizarTurno() {
    if (!this.turno) return;
    this.turnoService.realizarTurno(this.turno._id).subscribe(
      () => {
        // Recargar la página
        window.location.reload();
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error al confirmar el turno:', error);
      }
    );
  }

  getIconoTipo(): string {
    return 'bi bi-file-earmark text-primary';
  }

  verArchivo(url: string): void {
    window.open(url, '_blank');
  }

  // Métodos para el modal de archivos
  abrirModalArchivos() {
    const modalRef = this.modalService.open(UploadFileComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.turnoId = this.turno._id;
    modalRef.componentInstance.archivosExistentes = this.turno.archivos || [];

    // Suscribirse a eventos
    modalRef.componentInstance.archivoSubido.subscribe((archivo: any) => {
      // Actualizar la lista de archivos localmente
      if (!this.turno.archivos) {
        this.turno.archivos = [];
      }
      this.turno.archivos.push({
        url: archivo.url,
        tipo: archivo.tipo,
        nombre: archivo.nombre,
        _id: Date.now().toString(), // ID temporal
        fechaSubida: new Date().toISOString(),
      });
    });

    modalRef.componentInstance.cerrarModal.subscribe(() => {
      modalRef.close();
    });
  }
}
