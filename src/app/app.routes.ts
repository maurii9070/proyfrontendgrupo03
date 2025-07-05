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
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';

export const routes: Routes = [
  // Pagina de inicio
  {
    path: '',
    component: HomePageComponent,
  },

  // Autenticación
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/solicitud-dni',
    component: SolicitarDniGoogleComponent,
  },
  {
    path: 'login/registro-paciente',
    component: RegistroPacienteComponent,
  },
  {
    path: 'resetear-password',
    component: ResetearPasswordComponent
  },

  // paginas privadas
  {
    path: 'paciente/:idPaciente/turno/:idDoctor',
    component: TurnoReservaComponent,
  },
  
  {
    path: 'paciente/:idPaciente',
    component: MainPacienteComponent,
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

  // Paginas publicas
  {
    path: 'home/especialidades',
    component: EspecialidadesComponent
  },


  // Administración

  {
    path: 'admin',
    component: MainAdminComponent,
  },
  { path: 'doctor/:idDoctor', component: MainDoctorComponent },
  
  // Ruta wilcard para manejar rutas no definidas (dejar al final)
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
