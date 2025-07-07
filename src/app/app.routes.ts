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
import { ResetearPasswordDoctorComponent } from './pages/resetear-password-doctor/resetear-password-doctor.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AccesoDenegadoComponent } from './pages/acceso-denegado/acceso-denegado.component';
import { ResetearPasswordPacienteComponent } from './pages/resetear-password-paciente/resetear-password-paciente.component';

export const routes: Routes = [
  // *****     Rutas públicas (no requieren autenticación) ******

  // Pagina de inicio
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'especialidades',
    component: EspecialidadesComponent,
  },
  {
    path: 'acceso-denegado',
    component: AccesoDenegadoComponent,
  },
  {
    path: 'doctores',
    component: ListDoctoresComponent,
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
    component: ResetearPasswordComponent,
  },

  // *****     Rutas protegidas por rol (requieren autenticación y un rol específico) ******

  // rutas para pacientes
  {
    path: 'paciente/:idPaciente/turno/:idDoctor',
    component: TurnoReservaComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Paciente' }, // Solo pacientes pueden acceder a esta ruta
  },

  {
    path: 'paciente/:idPaciente',
    component: MainPacienteComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Paciente' }, // Solo pacientes pueden acceder a esta ruta
  },
  {
    path:'paciente/:dni/resetear-password',
    component: ResetearPasswordPacienteComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Paciente' }, // Solo pacientes pueden acceder a esta ruta
  },

  // rutas para doctores

  {
    path: 'doctor/:idDoctor',
    component: MainDoctorComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Doctor' }, // Solo doctores pueden acceder a esta ruta
  },

  {
    path: 'registro-doctor',
    component: RegistroDoctorComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }, // Solo administradores pueden acceder a esta
  },
  // rutas para administradores

  {
    path: 'admin',
    component: MainAdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }, // Solo administradores pueden acceder a esta
  },

  {
    path: 'estadisticas',
    component: EstadisticasComponent,
  },

  {
    path: 'doctor/:dni/resetear-password-doctor',
    component: ResetearPasswordDoctorComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Doctor' }, // Solo administradores pueden acceder a esta
  },

  // Ruta wilcard para manejar rutas no definidas (dejar al final)

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
