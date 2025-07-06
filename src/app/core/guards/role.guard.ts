// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { map, take, filter, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  const expectedRole = route.data?.['role'] as string; // Obtiene el rol esperado de la configuración de la ruta

  if (!expectedRole) {
    console.error(
      'RoleGuard: No se especificó un rol esperado en la configuración de la ruta.'
    );
    return router.parseUrl('/acceso-denegado');
  }

  // Solo verifica el rol (la autenticación ya fue verificada por authGuard)
  return authService.currentUserProfile$.pipe(
    filter((profile) => profile !== null && profile !== undefined), // Esperar hasta que el perfil no sea null ni undefined
    take(1), // Tomar solo el primer valor válido
    timeout(10000), // Aumentar timeout a 10 segundos
    map((profile) => {
      // En este punto, profile no debería ser null debido al filter
      if (!profile) {
        console.warn('RoleGuard: Perfil no cargado después de autenticación.');
        return router.parseUrl('/acceso-denegado');
      }

      // Verificar si el perfil tiene el rol requerido
      if (profile._rol === expectedRole) {
        return true; // El usuario tiene el rol requerido
      } else {
        console.warn(
          `RoleGuard: Acceso denegado. Rol '${profile._rol}' no coincide con el rol requerido '${expectedRole}'.`
        );
        return router.parseUrl('/acceso-denegado'); // Al acceso denegado si no tiene el rol
      }
    }),
    // Manejar timeout o errores
    catchError((error) => {
      console.error('RoleGuard: Error o timeout al cargar perfil:', error);
      return of(router.parseUrl('/acceso-denegado'));
    })
  );
};
