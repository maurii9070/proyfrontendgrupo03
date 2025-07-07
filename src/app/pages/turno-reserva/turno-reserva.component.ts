import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbDate,
  NgbDatepicker,
  NgbDateStruct,
  NgbCalendar,
  NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n } from '../../services/datepicker-i18n.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnoService } from '../../services/turno.service';
import { Doctor, DoctorService } from '../../services/doctor.service';
import { MercadoPagoService } from '../../services/mercado-pago.service';
import { Pago, PagoService } from '../../services/pago.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-turno-reserva',
  standalone: true,
  imports: [NgbDatepicker, FormsModule, CommonModule],
  providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
  templateUrl: './turno-reserva.component.html',
})
export class TurnoReservaComponent implements OnInit {
  botonPagoDeshabilitado: boolean = false;
  private calendar = inject(NgbCalendar);
  private router = inject(ActivatedRoute);
  private router_redireccion = inject(Router);
  private turnoService = inject(TurnoService);
  private doctorService = inject(DoctorService);
  private mercadoPagoService = inject(MercadoPagoService);
  private pagoService = inject(PagoService);
  private toastService = inject(ToastService);

  private idDoctor: string | null = null; // ID del doctor seleccionado
  turnosPorFecha: any[] = [];

  // Prueba para MercadoPago
  precioConsulta: number = 5000; // Precio de la consulta

  selectedDate: NgbDate | null = null;
  selectedHour: string | null = null;

  // Array de horas disponibles
  horas: string[] = [];

  idPaciente: string = ''; // ID del paciente, se puede obtener de la sesión o del servicio de autenticación
  observaciones: string = ''; // Observaciones del turno
  doctor: Doctor = undefined!; // Información del doctor seleccionado

  ngOnInit() {
    this.idDoctor = this.router.snapshot.paramMap.get('idDoctor');
    const startHour = 13;
    const endHour = 20;
    for (let hora = startHour; hora <= endHour; hora++) {
      this.horas.push(`${hora}:00`);
    }
    this.doctorService
      .getDoctorById(this.idDoctor!)
      .subscribe((doctor: Doctor) => {
        this.doctor = doctor;
        this.precioConsulta = doctor.precioConsulta;
        console.log('Doctor seleccionado:', this.doctor);
      });
  }

  // Deshabilitar fechas pasadas, fines de semana y fechas a más de 2 meses
  isDisabled = (
    date: NgbDateStruct,
    current?: { year: number; month: number }
  ) => {
    const today = this.calendar.getToday();
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const todayJs = new Date(today.year, today.month - 1, today.day);
    const dayOfWeek = jsDate.getDay();

    // Calcular fecha límite (2 meses desde hoy)
    const twoMonthsFromToday = new Date(todayJs);
    twoMonthsFromToday.setMonth(twoMonthsFromToday.getMonth() + 2);

    // Deshabilitar fechas pasadas (antes de hoy)
    const isBeforeToday = jsDate < todayJs;

    // Deshabilitar fines de semana (0 = domingo, 6 = sábado)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Deshabilitar fechas a más de 2 meses
    const isBeyondTwoMonths = jsDate > twoMonthsFromToday;

    return isBeforeToday || isWeekend || isBeyondTwoMonths;
  };

  onDateSelect(date: NgbDate) {
    this.selectedDate = date;
    this.turnoService
      .getTurnosByDoctorFecha(
        this.idDoctor!,
        `${date.day}/${date.month}/${date.year}`
      )
      .subscribe((response: any) => {
        this.turnosPorFecha = response;
        console.log(
          'Turnos disponibles para la fecha seleccionada:',
          this.turnosPorFecha
        );
      });
    this.selectedHour = null;
    console.log('Fecha seleccionada:', date);
  }

  deshabilitarHora(hora: string): boolean {
    // Deshabilitar horas que ya están ocupadas
    const ocupada = this.turnosPorFecha.some((turno) => turno.hora === hora);

    // Si la fecha seleccionada es hoy, deshabilitar horas pasadas
    if (this.selectedDate) {
      const today = this.calendar.getToday();
      if (
        this.selectedDate.year === today.year &&
        this.selectedDate.month === today.month &&
        this.selectedDate.day === today.day
      ) {
        const [horaNum] = hora.split(':').map(Number);
        const now = new Date();
        if (horaNum <= now.getHours()) {
          return true;
        }
      }
    }

    return ocupada;
  }

  onHourSelect(hour: string) {
    this.selectedHour = hour;
    console.log('Hora seleccionada:', hour);
  }

  onClickReservarConMercadoPago() {
    this.botonPagoDeshabilitado = true;
    if (!this.selectedDate || !this.selectedHour) {
      console.error('Fecha y hora deben estar seleccionadas');
      this.botonPagoDeshabilitado = false;
      return;
    }

    const fechaString = `${this.selectedDate.day}/${this.selectedDate.month}/${this.selectedDate.year}`;

    this.idPaciente = this.router.snapshot.paramMap.get('idPaciente') || '';
    console.log('ID del paciente:', this.idPaciente);
    this.turnoService
      .crearTurno(
        this.idPaciente,
        this.doctor._id,
        fechaString,
        this.selectedHour,
        this.observaciones
      )
      .subscribe({
        next: (response) => {
          console.log('Turno creado:', response);
          this.mercadoPagoService
            .crearPreferencia(this.doctor._id, response._id)
            .subscribe({
              next: (res) => {
                console.log('Preferencia creada:', res);
                window.location.href = res.init_point; // Redirige al Checkout Pro
              },
              error: (err) => {
                console.error('Error al crear preferencia:', err);
                this.botonPagoDeshabilitado = false;
              },
            });
        },
        error: (error) => {
          console.error('Error al crear el turno:', error);
          this.botonPagoDeshabilitado = false;
        },
      });
  }
  onClickReservarConTransferencia() {
    this.botonPagoDeshabilitado = true;
    if (!this.selectedDate || !this.selectedHour) {
      console.error('Fecha y hora deben estar seleccionadas');
      this.botonPagoDeshabilitado = false;
      return;
    }

    const fechaString = `${this.selectedDate.day}/${this.selectedDate.month}/${this.selectedDate.year}`;
    this.idPaciente = this.router.snapshot.paramMap.get('idPaciente') || '';
    this.turnoService
      .crearTurno(
        this.idPaciente,
        this.doctor._id,
        fechaString,
        this.selectedHour,
        this.observaciones
      )
      .subscribe({
        next: (response) => {
          console.log('Turno creado:', response);
          const pago: Pago = {
            monto: this.precioConsulta,
            metodoPago: 'transferencia',
            turno: response._id, // Asumiendo que el turno creado tiene un ID
          };
          this.pagoService.crearNuevoPago(pago).subscribe({
            next: (res) => {
              console.log('Pago creado:', res);
              // Aquí puedes mostrar un mensaje de éxito o redirigir al usuario
              this.toastService.showSuccess(
                'Turno reservado con éxito',
                'Pago realizado con transferencia. Seguir indicaciones para completar el proceso.'
              );
              this.router_redireccion.navigate(['/paciente', this.idPaciente]);
            },
            error: (err) => {
              console.error('Error al crear el pago:', err);
              this.botonPagoDeshabilitado = false;
            },
          });
        },
        error: (error) => {
          console.error('Error al crear el turno:', error);
          this.botonPagoDeshabilitado = false;
        },
      });
  }

  onClickVolver() {
    this.router_redireccion.navigate([
      '/paciente',
      this.router.snapshot.paramMap.get('idPaciente'),
    ]);
  }
}
