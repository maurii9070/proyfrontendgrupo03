import { Routes } from '@angular/router';
import { TurnoReservaComponent } from './pages/turno-reserva/turno-reserva.component';
import { LoginComponent } from './pages/login/login.component';
import { MainPacienteComponent } from './pages/main-paciente/main-paciente.component';
import { SolicitarDniGoogleComponent } from './pages/solicitar-dni-google/solicitar-dni-google.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegistroPacienteComponent } from './pages/registro-paciente/registro-paciente.component';
import { ListDoctoresComponent } from './pages/list-doctores/list-doctores.component';
import { RegistroDoctorComponent } from './pages/registro-doctor/registro-doctor.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { MainAdminComponent } from './pages/main-admin/main-admin.component';
import { MainDoctorComponent } from './pages/main-doctor/main-doctor.component';
import { ResetearPasswordComponent } from './pages/resetear-password/resetear-password.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'paciente/:idPaciente/turno/:idDoctor',
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
  { path: 'resetear-password', component: ResetearPasswordComponent },
  {
    path: 'paciente/:idPaciente',
    component: MainPacienteComponent,
  },
  {
    path: 'registro-paciente',
    component: RegistroPacienteComponent,
  },
  {
    path: 'doctores',
    component: ListDoctoresComponent,
  },
  {
    path: 'registro-doctor',
    component: RegistroDoctorComponent,
  },
  {
    path: 'estadisticas',
    component: EstadisticasComponent,
  },
  {
    path: 'admin',
    component: MainAdminComponent,
  },
  { path: 'doctor/:idDoctor', component: MainDoctorComponent },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
