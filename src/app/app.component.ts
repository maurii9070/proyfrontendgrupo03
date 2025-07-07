import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'proyfrontendgrupo03';
  showTopBar = true;
  showFooter = false;

  // Rutas donde se debe mostrar el footer
  private footerRoutes = ['/', '/especialidades', '/doctores'];

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkFooterVisibility(event.url);
    });
    
    // Verificar la ruta inicial
    this.checkFooterVisibility(this.router.url);
  }

  private checkFooterVisibility(url: string): void {
    // Limpiar parámetros de query y fragments
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Verificar si la ruta actual está en la lista de rutas que deben mostrar footer
    this.showFooter = this.footerRoutes.includes(cleanUrl);
    
    // Debug para verificar el comportamiento
    console.log('Current URL:', cleanUrl, 'Show Footer:', this.showFooter);
  }
}
