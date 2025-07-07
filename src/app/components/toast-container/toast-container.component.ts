import { Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgbToastModule],
  template: `
    @for (toast of toastService.toasts; track toast) {
    <ngb-toast
      [class]="toast.classname"
      [autohide]="toast.autohide ?? true"
      [delay]="toast.delay ?? 5000"
      (hiddenChange)="toastService.remove(toast)"
    >
      <div class="d-flex">
        <div class="toast-body">
          @if (toast.header) {
          <strong>{{ toast.header }}</strong>
          }
          <div>{{ toast.body }}</div>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          (click)="toastService.remove(toast)"
        ></button>
      </div>
    </ngb-toast>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1200;
      }
    `,
  ],
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
