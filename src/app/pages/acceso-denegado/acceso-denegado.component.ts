import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.css'
})
export class AccesoDenegadoComponent {
  private router = inject(Router);
  private authService = inject(AutenticacionService);

  // Observable para verificar si el usuario está autenticado
  isLoggedIn$ = this.authService.isLoggedIn$;

  // Método para redirigir al inicio
  goToHome() {
    this.router.navigate(['/']);
  }

  // Método para redirigir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
