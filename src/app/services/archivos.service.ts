import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

export interface ArchivoSubida {
  _id: string;
  url: string;
  tipo: string;
  nombre: string;
  fechaSubida: string;
}

export interface ValidacionArchivo {
  esValido: boolean;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  private http = inject(HttpClient);
  private firestoreService = inject(FirestoreService);

  private baseUrl = environment.apiUrl + '/archivos';

  private readonly TIPOS_PERMITIDOS = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  private readonly TAMAÑO_MAXIMO = 10 * 1024 * 1024; // 10MB

  subirArchivoMedico(url: string, idTurno: string, nombre: string) {
    return this.http.post<any>(`${this.baseUrl}/${idTurno}`, {
      tipo: 'medico',
      url,
      nombre,
    });
  }

  subirArchivoPago(url: string, idTurno: string, nombre: string) {
    return this.http.post<any>(`${this.baseUrl}/${idTurno}`, {
      tipo: 'pago',
      url,
      nombre,
    });
  }

  eliminarArchivo(idArchivo: string) {
    return this.http.delete<any>(`${this.baseUrl}/${idArchivo}`);
  }

  /**
   * Valida si un archivo cumple con los requisitos
   */
  validarArchivo(file: File): ValidacionArchivo {
    if (!this.TIPOS_PERMITIDOS.includes(file.type)) {
      return {
        esValido: false,
        mensaje: 'Solo se permiten imágenes, PDFs y documentos de Word.',
      };
    }

    if (file.size > this.TAMAÑO_MAXIMO) {
      return {
        esValido: false,
        mensaje: 'El archivo es demasiado grande. Máximo 10MB.',
      };
    }

    return { esValido: true };
  }

  /**
   * Sube un comprobante de pago completo (Firebase + Backend)
   */
  subirComprobanteCompleto(
    file: File,
    idTurno: string
  ): Observable<ArchivoSubida> {
    const fileName = `turno_${idTurno}_${Date.now()}_comprobante`;

    return this.firestoreService.uploadComprobantePago(file, fileName).pipe(
      switchMap((downloadUrl: string) => {
        return this.subirArchivoPago(downloadUrl, idTurno, 'comprobante').pipe(
          switchMap((response) => {
            if (!response._id) {
              throw new Error(
                'El backend no devolvió un ID válido para el archivo'
              );
            }

            const archivo: ArchivoSubida = {
              _id: response._id,
              url: downloadUrl,
              tipo: 'pago',
              nombre: 'comprobante',
              fechaSubida: new Date().toISOString(),
            };
            return of(archivo);
          })
        );
      }),
      catchError((error) => {
        console.error('Error en subida completa:', error);
        throw error;
      })
    );
  }

  /**
   * Sube un archivo médico completo (Firebase + Backend)
   */
  subirArchivoMedicoCompleto(
    file: File,
    idTurno: string
  ): Observable<ArchivoSubida> {
    const fileName = `turno_${idTurno}_${Date.now()}_medico`;

    return this.firestoreService.uploadArchivoMedico(file, fileName).pipe(
      switchMap((downloadUrl: string) => {
        return this.subirArchivoMedico(downloadUrl, idTurno, file.name).pipe(
          switchMap((response) => {
            if (!response._id) {
              throw new Error(
                'El backend no devolvió un ID válido para el archivo'
              );
            }

            const archivo: ArchivoSubida = {
              _id: response._id,
              url: downloadUrl,
              tipo: 'medico',
              nombre: file.name,
              fechaSubida: new Date().toISOString(),
            };
            return of(archivo);
          })
        );
      }),
      catchError((error) => {
        console.error('Error en subida completa de archivo médico:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un archivo completo (Backend + Firebase)
   */
  eliminarArchivoCompleto(archivo: {
    _id: string;
    url: string;
  }): Observable<any> {
    return this.eliminarArchivo(archivo._id).pipe(
      switchMap((response) => {
        // Eliminar de Firebase Storage
        const fileName = this.extractFileNameFromUrl(archivo.url);
        if (fileName) {
          const filePath = `comprobantes-pago/${fileName}`;
          return this.firestoreService.deleteFile(filePath).pipe(
            switchMap(() => of(response)),
            catchError((firebaseError) => {
              console.error('Error al eliminar de Firebase:', firebaseError);
              // Aún así retornamos success del backend
              return of(response);
            })
          );
        }
        return of(response);
      }),
      catchError((error) => {
        console.error('Error al eliminar archivo completo:', error);
        throw error;
      })
    );
  }

  /**
   * Reemplaza un comprobante existente
   */
  reemplazarComprobante(
    file: File,
    idTurno: string,
    archivoAnterior: { _id: string; url: string }
  ): Observable<ArchivoSubida> {
    // Primero eliminar el anterior, luego subir el nuevo
    return this.eliminarArchivoCompleto(archivoAnterior).pipe(
      switchMap(() => this.subirComprobanteCompleto(file, idTurno)),
      catchError((error) => {
        console.error('Error al reemplazar comprobante:', error);
        throw error;
      })
    );
  }

  /**
   * Extrae el nombre del archivo de una URL de Firebase
   */
  private extractFileNameFromUrl(url: string): string | null {
    try {
      const decodedUrl = decodeURIComponent(url);
      const match = decodedUrl.match(/comprobantes-pago%2F([^?]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error al extraer nombre del archivo:', error);
      return null;
    }
  }
}
