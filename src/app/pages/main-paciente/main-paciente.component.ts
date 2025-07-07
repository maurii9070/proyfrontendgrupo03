

import { CommonModule } from '@angular/common';
import { ListDoctoresComponent } from '../list-doctores/list-doctores.component';
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { TurnoService } from '../../services/turno.service';
import { ToastService } from '../../services/toast.service';
import { Especialidad } from '../list-doctores/list-doctores.component';
import { ArchivosService, ArchivoSubida } from '../../services/archivos.service';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
export interface Paciente {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  uid_firebase?: string;
}
export interface Doctor {
  _id: string;
  nombre: string;
  apellido: string;
  especialidad: Especialidad;
  telefono: string;
  email: string;
}
export interface Archivo {
  _id: string;
  nombre: string;
  url: string;
  tipo: string; // 'comprobante-pago' | 'archivo-medico'
  fechaSubida: string;
}
export interface Turno {
  _id: string;
  fecha: string;
  hora: string;
  paciente: Paciente;
  doctor: Doctor;
  estado: string;
  observaciones: string;
  archivos: Archivo[];
}
@Component({
  selector: 'app-main-paciente',
  imports: [CommonModule, ListDoctoresComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './main-paciente.component.html',
  styleUrls: ['./main-paciente.component.css'],
})
export class MainPacienteComponent implements OnInit {
  // Modal edición perfil
  mostrarModalEditarPerfil = false;
  formEditarPerfil!: FormGroup;
  cargandoEdicion = false;
  formBuilder = inject(FormBuilder);
  pacienteId: string = '';
  pacienteService = inject(PacienteService);
  route = inject(ActivatedRoute);
  turnoService = inject(TurnoService);
  toastService = inject(ToastService);
  archivosService = inject(ArchivosService);
  private router = inject(Router);
  mostrarBotonTurno = true; // Controla la visibilidad del botón de solicitar turno
  paciente: Paciente = {
    _id: '',
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
  };
  turnos: Turno[] = [];
  estadoFiltro: string = 'todos';
  estadosTurno: { value: string; label: string; icon: string }[] = [
    { value: 'todos', label: 'Todos', icon: 'bi-list-check' },
    { value: 'pendiente', label: 'Pendiente', icon: 'bi-hourglass-split' },
    { value: 'confirmado', label: 'Confirmado', icon: 'bi-check-circle' },
    { value: 'realizado', label: 'Realizado', icon: 'bi-calendar-check' },
    { value: 'cancelado', label: 'Cancelado', icon: 'bi-x-circle' },
  ];
  @ViewChild('modalCancelarTurno') modalCancelarTurno: any;
  @ViewChild('fileInputComprobante')
  fileInputComprobante!: ElementRef<HTMLInputElement>;
  turnoIdParaCancelar: string | null = null;
  mostrarModal = false;
  mostrarDoctores = false;
  // MODAL DETALLE TURNO
  mostrarModalDetalle: boolean = false;
  detalleTurno: any = null;

  // SUBIDA DIRECTA DE COMPROBANTES
  subiendoComprobante: boolean = false;

  // Variable para controlar si estamos reemplazando un comprobante
  reemplazandoComprobante: Archivo | null = null;

    // Dropdown filtro estado (Angular, sin Bootstrap JS)
  filtroDropdownAbierto: boolean = false;

  toggleFiltroDropdown() {
    this.filtroDropdownAbierto = !this.filtroDropdownAbierto;
  }


  cerrarFiltroDropdown() {
    this.filtroDropdownAbierto = false;
  }
  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('idPaciente') || '';
    this.pacienteService.getPacienteById(this.pacienteId).subscribe(
      (data: any) => {
        this.paciente = data;
        this.inicializarFormEditarPerfil();
      },
      (error) => {
        console.error('Error al obtener los datos del paciente:', error);
      }
    );
    this.cargarTurnos();
  }
  
  inicializarFormEditarPerfil() {
    this.formEditarPerfil = this.formBuilder.group({
      email: [{ value: this.paciente.email, disabled: !!this.paciente.uid_firebase }, [Validators.required, Validators.email]],
      telefono: [this.paciente.telefono, [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
    });
  }

  abrirModalEditarPerfil() {
    this.inicializarFormEditarPerfil();
    this.mostrarModalEditarPerfil = true;
  }

  cerrarModalEditarPerfil() {
    this.mostrarModalEditarPerfil = false;
    this.formEditarPerfil?.reset();
  }

  onSubmitEditarPerfil() {
    if (this.formEditarPerfil.invalid) return;
    this.cargandoEdicion = true;
    const email = this.formEditarPerfil.get('email')?.value;
    const telefono:string = this.formEditarPerfil.get('telefono')?.value;
    this.pacienteService.updatePaciente(this.pacienteId, email, telefono).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess('Datos actualizados correctamente');
        this.paciente.email = email;
        this.paciente.telefono = telefono;
        this.cerrarModalEditarPerfil();
        this.cargandoEdicion = false;
      },
      error: (err: any) => {
        this.toastService.showError('Error al actualizar los datos');
        this.cargandoEdicion = false;
      }
    });
  }
  onClickDesvincular(){
    this.pacienteService.desvincularGoogle(this.pacienteId).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess('Cuenta desvinculada exitosamente');
        this.router.navigate(['/resetear-password']);
      },
      error: (err: any) => {
        this.toastService.showError('Error al desvincular la cuenta');
      }
    });
  }
  onForgotPassword() {
    this.router.navigate([
      '/paciente/' + this.paciente.dni + '/resetear-password',
    ]);
  }

  cargarTurnos() {
    console.log('Cargando turnos para el paciente:', this.pacienteId);
    
    if (this.estadoFiltro === 'todos') {
      this.turnoService.getTurnosByPacienteId(this.pacienteId).subscribe(
        (data: any) => {
          this.turnos = data.sort((a: Turno, b: Turno) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
        },
        (error) => {
          console.error('Error al obtener los turnos del paciente:', error);
        }
      );
    } else {
      this.turnoService.getTurnosByEstado(this.estadoFiltro, this.pacienteId).subscribe(
        (data: any) => {
          this.turnos = data.sort((a: Turno, b: Turno) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
          console.log('Turnos filtrados por estado:', this.estadoFiltro, this.turnos);
        },
        (error) => {
          console.error('Error al filtrar los turnos:', error);
        }
      );
    }
  }

  onEstadoFiltroChange(estado: string) {
    this.estadoFiltro = estado;
    this.cargarTurnos();
    this.filtroDropdownAbierto = false;
  }

  abrirModalDetalle(turnoId: string) {
    this.turnoService.getTurnoById(turnoId).subscribe((turno: any) => {
      this.detalleTurno = turno;
      this.mostrarModalDetalle = true;
    });
  }

  cerrarModalDetalle() {
    this.mostrarModalDetalle = false;
    this.detalleTurno = null;
  }
  get tieneTurnos(): boolean {
    return this.turnos.length > 0;
  }
  mostrarModalCancelar(turnoId: string) {
    this.turnoIdParaCancelar = turnoId;
    this.mostrarModal = true;
  }

  cerrarModalCancelar() {
    this.mostrarModal = false;
    this.turnoIdParaCancelar = null;
  }

  confirmarCancelarTurno() {
    if (!this.turnoIdParaCancelar) return;
    this.turnoService.cancelarTurno(this.turnoIdParaCancelar).subscribe(
      () => {
        this.cerrarModalCancelar();
        this.toastService.showSuccess('Turno cancelado exitosamente.');
        // Recargar la página
        window.location.reload();
      },
      (error) => {
        console.error('Error al cancelar el turno:', error);
        this.cerrarModalCancelar();
        this.toastService.showError(
          'No se pudo cancelar el turno. Inténtalo más tarde.'
        );
      }
    );
  }

  onClickSolicitarTurno() {
    // Mostrar el componente de doctores como hijo
    this.mostrarDoctores = true;
  }

  onCerrarDoctores() {
    this.mostrarDoctores = false;
  }

  onComprobanteSubido(archivo: ArchivoSubida) {
    // Refresca los archivos del detalleTurno
    if (this.detalleTurno && archivo) {
      if (this.reemplazandoComprobante) {
        // Reemplazar el archivo existente
        const index = this.detalleTurno.archivos.findIndex(
          (a: Archivo) => a._id === this.reemplazandoComprobante!._id
        );
        if (index !== -1) {
          this.detalleTurno.archivos[index] = archivo;
        }
      } else {
        // Agregar nuevo archivo
        this.detalleTurno.archivos = [
          ...(this.detalleTurno.archivos || []),
          archivo,
        ];
      }
    }

    // Limpiar estado
    this.reemplazandoComprobante = null;
    this.subiendoComprobante = false;
  }

  // Métodos para subida directa de comprobantes
  iniciarSubidaComprobante() {
    this.reemplazandoComprobante = null;
    this.fileInputComprobante.nativeElement.click();
  }

  iniciarReemplazoComprobante(archivo: Archivo) {
    this.reemplazandoComprobante = archivo;
    this.fileInputComprobante.nativeElement.click();
  }

  onArchivoSeleccionado(event: any) {
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
    this.subirComprobante(file);
    event.target.value = '';
  }

  private subirComprobante(file: File) {
    if (!this.detalleTurno) return;

    this.subiendoComprobante = true;
    const esReemplazo = !!this.reemplazandoComprobante;

    // Usar el método apropiado del servicio
    const operacion = esReemplazo
      ? this.archivosService.reemplazarComprobante(
          file,
          this.detalleTurno._id,
          this.reemplazandoComprobante!
        )
      : this.archivosService.subirComprobanteCompleto(
          file,
          this.detalleTurno._id
        );

    operacion.subscribe({
      next: (archivo: ArchivoSubida) => {
        this.onComprobanteSubido(archivo);
        this.toastService.showSuccess(
          esReemplazo
            ? 'Comprobante reemplazado exitosamente'
            : 'Comprobante subido exitosamente',
          'Éxito'
        );
      },
      error: (error) => {
        this.subiendoComprobante = false;
        this.reemplazandoComprobante = null;
        this.toastService.showError(
          esReemplazo
            ? 'Error al reemplazar el comprobante'
            : 'Error al subir el comprobante',
          'Error'
        );
        console.error('Error en operación de archivo:', error);
      },
    });
  }

  getArchivosPago(archivos: Archivo[] | undefined): Archivo[] {
    if (!archivos) return [];
    return archivos.filter((archivo) => archivo.tipo === 'pago');
  }

  getArchivosMedicos(archivos: Archivo[] | undefined): Archivo[] {
    if (!archivos) return [];
    return archivos.filter((archivo) => archivo.tipo === 'medico');
  }
    getEstadoFiltroLabel(): string {
    if (!Array.isArray(this.estadosTurno)) return '';
    const found = this.estadosTurno.find((e: any) => e.value === this.estadoFiltro);
    return found ? found.label : '';
  }

  getEstadoFiltroIcon(): string {
    if (!Array.isArray(this.estadosTurno)) return '';
    const found = this.estadosTurno.find((e: any) => e.value === this.estadoFiltro);
    return found ? found.icon : '';
  }
}

