import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { ArchivosService } from '../../services/archivos.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-upload-file',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css',
})
export class UploadFileComponent {
  @Input() turnoId: string = '';
  @Input() archivosExistentes: any[] = [];
  @Input() tipo: 'medico' | 'pago' = 'medico';
  @Output() archivoSubido = new EventEmitter<any>();
  @Output() cerrarModal = new EventEmitter<void>();

  private firestoreService = inject(FirestoreService);
  private archivosService = inject(ArchivosService);
  private toastService = inject(ToastService);

  // Subida de archivos
  archivoSeleccionado: File | null = null;
  subiendoArchivo: boolean = false;
  nombrePersonalizado: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        this.toastService.showError(
          'Solo se permiten imágenes, PDFs y documentos de Word.',
          'Tipo de archivo no permitido'
        );
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.toastService.showError(
          'El archivo es demasiado grande. Máximo 10MB.',
          'Archivo muy grande'
        );
        return;
      }

      this.archivoSeleccionado = file;
      // Si es comprobante de pago, nombre predefinido
      if (this.tipo === 'pago') {
        this.nombrePersonalizado = 'comprobante';
      }
    }
    // Limpiar el input
    event.target.value = '';
  }

  cancelarSubidaArchivo() {
    this.archivoSeleccionado = null;
    this.nombrePersonalizado = '';
  }

  confirmarSubidaArchivo() {
    if (!this.turnoId || !this.archivoSeleccionado) return;

    // Validar que el nombre personalizado sea obligatorio
    if (!this.nombrePersonalizado.trim()) {
      this.toastService.showError(
        'El nombre del archivo es obligatorio',
        'Campo requerido'
      );
      return;
    }

    this.subiendoArchivo = true;

    // Crear nombre personalizado con el ID del turno
    const baseFileName = this.nombrePersonalizado.trim();
    const fileName = `turno_${this.turnoId}_${Date.now()}_${baseFileName}`;

    if (this.tipo === 'pago') {
      // Subir comprobante de pago a Firebase Storage
      this.firestoreService
        .uploadComprobantePago(this.archivoSeleccionado, fileName)
        .subscribe({
          next: (downloadUrl: string) => {
            // Guardar URL en la base de datos usando el servicio
            this.archivosService
              .subirArchivoPago(
                downloadUrl,
                this.turnoId,
                this.nombrePersonalizado
              )
              .subscribe({
                next: (response) => {
                  this.subiendoArchivo = false;
                  this.archivoSeleccionado = null;
                  this.nombrePersonalizado = '';
                  this.archivoSubido.emit({
                    url: downloadUrl,
                    tipo: 'pago',
                    nombre: baseFileName,
                  });
                  this.toastService.showSuccess(
                    'El comprobante se ha subido correctamente',
                    'Comprobante subido'
                  );
                },
                error: (error) => {
                  this.subiendoArchivo = false;
                  this.toastService.showError(
                    'No se pudo registrar el comprobante en la base de datos',
                    'Error en la base de datos'
                  );
                },
              });
          },
          error: (error) => {
            this.subiendoArchivo = false;
            this.toastService.showError(
              'No se pudo subir el comprobante al almacenamiento',
              'Error de subida'
            );
          },
        });
    } else {
      // Subir archivo médico a Firebase Storage
      this.firestoreService
        .uploadArchivoMedico(this.archivoSeleccionado, fileName)
        .subscribe({
          next: (downloadUrl: string) => {
            this.archivosService
              .subirArchivoMedico(
                downloadUrl,
                this.turnoId,
                this.nombrePersonalizado
              )
              .subscribe({
                next: (response) => {
                  this.subiendoArchivo = false;
                  this.archivoSeleccionado = null;
                  this.nombrePersonalizado = '';
                  this.archivoSubido.emit({
                    url: downloadUrl,
                    tipo: 'medico',
                    nombre: baseFileName,
                  });
                  this.toastService.showSuccess(
                    'El archivo se ha subido correctamente',
                    'Archivo subido'
                  );
                },
                error: (error) => {
                  this.subiendoArchivo = false;
                  this.toastService.showError(
                    'No se pudo registrar el archivo en la base de datos',
                    'Error en la base de datos'
                  );
                },
              });
          },
          error: (error) => {
            this.subiendoArchivo = false;
            this.toastService.showError(
              'No se pudo subir el archivo al almacenamiento',
              'Error de subida'
            );
          },
        });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getIconoTipo(): string {
    return 'bi bi-file-earmark text-primary';
  }

  verArchivo(url: string): void {
    window.open(url, '_blank');
  }

  cerrar() {
    this.cerrarModal.emit();
  }
}
