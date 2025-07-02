import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showTopBar: boolean = true; //variable para controlar la visibilidad de la barra superior

  //constructor
  constructor(private router: Router) {}
  ngOnInit() {
    
    this.router.events.pipe(
      // Filtrar eventos de navegación
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // definir las rutas donde no debe aparecer la top bar
      const routesToHideTopBar = [
        '/login',
        '/login/solicitud-dni',
        '/paciente',
        '/admin',
        '/doctor',
      ];

      // Verificar si la ruta actual está en la lista de rutas para ocultar la barra superior
      this.showTopBar = !routesToHideTopBar.some(route => event.urlAfterRedirects.startsWith(route));


    });

  }

}
