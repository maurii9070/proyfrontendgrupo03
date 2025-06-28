import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginData = {
    dni: '',
    password: '',
  };

  isLoading = false;
  showPassword = false;

  constructor() {}

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;

      // Simulación de proceso de login
      console.log('Datos de login:', this.loginData);

      // Aquí iría la lógica de autenticación
      setTimeout(() => {
        this.isLoading = false;
        // Redirect o manejo de respuesta
      }, 2000);
    }
  }

  isFormValid(): boolean {
    return (
      this.loginData.dni.length >= 7 &&
      this.loginData.dni.length <= 8 &&
      this.loginData.password.length >= 6
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onCreateAccount() {
    // Navegación a página de registro
    console.log('Navegando a crear cuenta...');
  }

  onGoogleLogin() {
    // Lógica para login con Google
    console.log('Iniciando sesión con Google...');
    // Aquí iría la integración con Google OAuth
  }

  onForgotPassword() {
    // Lógica para recuperar contraseña
    console.log('Recuperar contraseña...');
  }
}
