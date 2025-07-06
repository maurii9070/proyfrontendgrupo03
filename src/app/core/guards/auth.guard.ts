import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { take } from 'rxjs';
import { AutenticacionService } from '../../services/autenticacion.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AutenticacionService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  return authService.isLoggedIn$.pipe(
    take(1), // Tomamos solo el primer valor emitido
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Si está autenticado, permitimos el acceso
        return true;
      } else {
        // Si no está autenticado, redirigimos al login
        console.warn('Acceso denegado - Usuario no autenticado');
        return router.parseUrl('/login');
      }
    })
  );
  
};
