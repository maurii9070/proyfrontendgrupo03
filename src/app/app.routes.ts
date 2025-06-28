import { Routes } from '@angular/router';
import { TurnoReservaComponent } from './pages/turno-reserva/turno-reserva.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'paciente/turno/:idDoctor',
    component: TurnoReservaComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
