import { Injectable } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private storage: Storage) {}

  /**
   * Sube un archivo a la carpeta archivos-medicos
   * @param file - Archivo a subir
   * @param fileName - Nombre personalizado del archivo (opcional)
   * @returns Observable con la URL de descarga
   */
  uploadArchivoMedico(file: File, fileName?: string): Observable<string> {
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const filePath = `archivos-medicos/${finalFileName}`;
    const fileRef = ref(this.storage, filePath);

    return from(uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef)));
  }

  /**
   * Sube un archivo a la carpeta comprobantes-pago
   * @param file - Archivo a subir
   * @param fileName - Nombre personalizado del archivo (opcional)
   * @returns Observable con la URL de descarga
   */
  uploadComprobantePago(file: File, fileName?: string): Observable<string> {
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const filePath = `comprobantes-pago/${finalFileName}`;
    const fileRef = ref(this.storage, filePath);

    return from(uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef)));
  }

  /**
   * Sube un archivo a una carpeta específica
   * @param file - Archivo a subir
   * @param folder - Carpeta destino
   * @param fileName - Nombre personalizado del archivo (opcional)
   * @returns Observable con la URL de descarga
   */
  uploadFile(
    file: File,
    folder: string,
    fileName?: string
  ): Observable<string> {
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const filePath = `${folder}/${finalFileName}`;
    const fileRef = ref(this.storage, filePath);

    return from(uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef)));
  }

  /**
   * Elimina un archivo del storage
   * @param filePath - Ruta completa del archivo
   * @returns Observable void
   */
  deleteFile(filePath: string): Observable<void> {
    const fileRef = ref(this.storage, filePath);
    return from(deleteObject(fileRef));
  }

  /**
   * Lista todos los archivos de una carpeta
   * @param folder - Nombre de la carpeta
   * @returns Observable con la lista de referencias de archivos
   */
  listFilesInFolder(folder: string): Observable<any> {
    const folderRef = ref(this.storage, folder);
    return from(listAll(folderRef));
  }

  /**
   * Obtiene la URL de descarga de un archivo
   * @param filePath - Ruta completa del archivo
   * @returns Observable con la URL de descarga
   */
  getDownloadURL(filePath: string): Observable<string> {
    const fileRef = ref(this.storage, filePath);
    return from(getDownloadURL(fileRef));
  }

  // Esto es para el commponente que use el servicio FirestoreService
  //   onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Validar tipo de archivo (opcional)
  //     const allowedTypes = [
  //       'image/jpeg',
  //       'image/png',
  //       'image/jpg',
  //       'application/pdf',
  //       'application/msword',
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //     ];
  //     if (!allowedTypes.includes(file.type)) {
  //       this.toastService.showError(
  //         'Tipo de archivo no permitido. Solo se permiten imágenes, PDFs y documentos de Word.'
  //       );
  //       return;
  //     }

  //     // Validar tamaño (máximo 10MB)
  //     if (file.size > 10 * 1024 * 1024) {
  //       this.toastService.showError(
  //         'El archivo es demasiado grande. Máximo 10MB.'
  //       );
  //       return;
  //     }

  //     this.selectedFile = file;
  //   }
  // }
}
