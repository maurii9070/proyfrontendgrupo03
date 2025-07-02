import { Routes } from '@angular/router';
import { TurnoReservaComponent } from './pages/turno-reserva/turno-reserva.component';
import { LoginComponent } from './pages/login/login.component';
import { MainPacienteComponent } from './pages/main-paciente/main-paciente.component';
import { SolicitarDniGoogleComponent } from './pages/solicitar-dni-google/solicitar-dni-google.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'paciente/turno/:idDoctor',
    component: TurnoReservaComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/solicitud-dni',
    component: SolicitarDniGoogleComponent,
  },
  {
    path: 'paciente/:idPaciente',
    component: MainPacienteComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];