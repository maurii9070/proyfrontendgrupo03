import { Routes } from '@angular/router';
import { TurnoReservaComponent } from './pages/turno-reserva/turno-reserva.component';

export const routes: Routes = [
  {
    path: 'paciente/turno/:idDoctor',
    component: TurnoReservaComponent,
  },
];
