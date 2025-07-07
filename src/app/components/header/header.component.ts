import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { AuthFirebaseService } from '../../services/auth-firebase.service';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, RouterLink, AsyncPipe, TitleCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Servicios inyectados
  private authService = inject(AutenticacionService);
  private authFirebaseService = inject(AuthFirebaseService);
  private router = inject(Router);

  // Observables reactivos para el template
  isLoggedIn$ = this.authService.isLoggedIn$;
  currentUserProfile$ = this.authService.currentUserProfile$;

  // Estado del dropdown
  isDropdownOpen = false;

  // Estado del menú móvil
  isMenuCollapsed = true;

  constructor() {}

  ngOnInit() {
    // Lógica adicional al inicializar el componente si es necesaria
  }

  ngOnDestroy() {
    // Cleanup si es necesario (aunque con AsyncPipe no es requerido)
  }

  // Método para alternar el dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Método para cerrar el dropdown
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  // Cerrar dropdown al hacer click fuera de él
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    if (!dropdown) {
      this.closeDropdown();
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      // Cerrar sesión en Firebase primero
      await this.authFirebaseService.logout();
    } catch (error) {
      console.warn('Error al cerrar sesión en Firebase:', error);
    }

    // Cerrar sesión en el servicio local
    this.authService.logout();
    this.closeDropdown();
    this.router.navigate(['/']);
  }

  // Método helper para verificar roles
  hasRole(role: string, userProfile: any): boolean {
    return userProfile && userProfile._rol === role;
  }

  // Método para alternar el menú móvil
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  // Al hacer click en un enlace del menú móvil, cerrarlo
  closeMenu() {
    this.isMenuCollapsed = true;
  }
}
