import { Component, ViewChild, ElementRef } from '@angular/core';
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
import {
  ArchivosService,
  ArchivoSubida,
} from '../../services/archivos.service';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';

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

  // ViewChild para el input file
  @ViewChild('fileInputMedico') fileInputMedico!: ElementRef<HTMLInputElement>;

  // Edición de observaciones
  editandoObservacion: boolean = false;
  observacionEdit: string = '';
  guardandoObservacion: boolean = false;

  // Subida directa de archivos
  subiendoArchivoMedico: boolean = false;

  // Edición de perfil
  editandoPerfil: boolean = false;
  doctorEdit: any = {};
  guardandoPerfil: boolean = false;

  token: string = '';
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private autenticationService: AutenticacionService
  ) {
    this.token = this.autenticationService.getToken()!;
  }

  // Método removido - ya no se usa modal para subir archivos

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
    this.turnoService.realizarTurno(this.turno._id, this.token).subscribe(
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

  // Métodos para subida directa de archivos médicos
  iniciarSubidaArchivoMedico() {
    this.fileInputMedico.nativeElement.click();
  }

  onArchivoMedicoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo usando el servicio
    const validacion = this.archivosService.validarArchivo(file);
    if (!validacion.esValido) {
      this.toastService.showError(validacion.mensaje!, 'Archivo no válido');
      event.target.value = '';
      return;
    }

    // Proceder con la subida
    this.subirArchivoMedico(file);
    event.target.value = '';
  }

  private subirArchivoMedico(file: File) {
    if (!this.turno._id) return;

    this.subiendoArchivoMedico = true;

    // Usar el servicio para subir archivo médico
    this.archivosService
      .subirArchivoMedicoCompleto(file, this.turno._id)
      .subscribe({
        next: (archivo: ArchivoSubida) => {
          // Actualizar la lista de archivos localmente
          if (!this.turno.archivos) {
            this.turno.archivos = [];
          }
          this.turno.archivos.push({
            url: archivo.url,
            tipo: archivo.tipo,
            nombre: archivo.nombre,
            _id: archivo._id,
            fechaSubida: archivo.fechaSubida,
          });

          this.subiendoArchivoMedico = false;
          this.toastService.showSuccess(
            'Archivo médico subido exitosamente',
            'Éxito'
          );

          // Modal se mantiene abierto para mejor UX
          // this.modalService.dismissAll();
        },
        error: (error) => {
          this.subiendoArchivoMedico = false;
          this.toastService.showError(
            'Error al subir el archivo médico',
            'Error'
          );
          console.error('Error en subida de archivo médico:', error);
        },
      });
  }

  // Método para eliminar archivos médicos
  eliminarArchivoMedico(archivo: any) {
    if (!confirm('¿Está seguro de que desea eliminar este archivo?')) {
      return;
    }

    this.archivosService.eliminarArchivoCompleto(archivo).subscribe({
      next: () => {
        // Eliminar de la lista local
        this.turno.archivos = this.turno.archivos.filter(
          (a) => a._id !== archivo._id
        );
        this.toastService.showSuccess(
          'Archivo eliminado exitosamente',
          'Éxito'
        );
      },
      error: (error) => {
        this.toastService.showError('Error al eliminar el archivo', 'Error');
        console.error('Error al eliminar archivo:', error);
      },
    });
  }
  onForgotPassword() {
    this.router.navigate([
      '/doctor/' + this.doctor.dni + '/resetear-password-doctor',
    ]);
  }

  // Métodos para editar perfil
  iniciarEdicionPerfil() {
    this.editandoPerfil = true;
    this.doctorEdit = {
      email: this.doctor.email || '',
      telefono: this.doctor.telefono || '',
      precioConsulta: this.doctor.precioConsulta || 0,
    };
  }

  cancelarEdicionPerfil() {
    this.editandoPerfil = false;
    this.doctorEdit = {};
  }

  guardarPerfil() {
    if (!this.doctor._id) return;

    this.guardandoPerfil = true;
    this.doctorService
      .actualizarDoctor(this.doctor._id, this.doctorEdit, this.token)
      .subscribe({
        next: (response: any) => {
          // Actualizar los datos del doctor en la vista
          this.doctor.email = this.doctorEdit.email;
          this.doctor.telefono = this.doctorEdit.telefono;
          this.doctor.precioConsulta = this.doctorEdit.precioConsulta;

          this.editandoPerfil = false;
          this.guardandoPerfil = false;
          this.toastService.showSuccess(
            'Perfil actualizado exitosamente',
            'Éxito'
          );
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          this.guardandoPerfil = false;
          this.toastService.showError(
            error.error?.message || 'Error al actualizar el perfil',
            'Error'
          );
        },
      });
  }
}
