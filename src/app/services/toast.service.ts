import { Injectable, inject } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

export interface ToastInfo {
  header?: string;
  body: string;
  delay?: number;
  autohide?: boolean;
  classname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: ToastInfo[] = [];

  show(toast: ToastInfo) {
    this.toasts.push({
      delay: 5000,
      autohide: true,
      ...toast,
    });
  }

  showSuccess(message: string, header = 'Éxito') {
    this.show({
      header,
      body: message,
      classname: 'bg-success text-light',
    });
  }

  showError(message: string, header = 'Error') {
    this.show({
      header,
      body: message,
      classname: 'bg-danger text-light',
    });
  }

  showInfo(message: string, header = 'Información') {
    this.show({
      header,
      body: message,
      classname: 'bg-info text-light',
    });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
