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

@Component({
  selector: 'app-turno-reserva',
  standalone: true,
  imports: [NgbDatepicker, FormsModule, CommonModule],
  providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
  templateUrl: './turno-reserva.component.html',
})
export class TurnoReservaComponent implements OnInit {
  private calendar = inject(NgbCalendar);
  private router = inject(ActivatedRoute);
  private turnoService = inject(TurnoService);

  private idDoctor: string | null = null; // ID del doctor seleccionado
  turnosPorFecha: any[] = [];

  // Prueba para MercadoPago
  precioConsulta: number = 5000; // Precio de la consulta

  selectedDate: NgbDate | null = null;
  selectedHour: string | null = null;

  // Array de horas disponibles
  horas: string[] = [];

  ngOnInit() {
    this.idDoctor = this.router.snapshot.paramMap.get('idDoctor');
    const startHour = 13;
    const endHour = 20;
    for (let hora = startHour; hora <= endHour; hora++) {
      this.horas.push(`${hora}:00`);
    }
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
}
