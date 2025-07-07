import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  getWeekdayLabel(weekday: number): string {
    // Con firstDayOfWeek=7, el orden será: 7=Do, 1=Lu, 2=Ma, 3=Mi, 4=Ju, 5=Vi, 6=Sa
    const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    return weekdays[weekday - 1];
  }

  getWeekdayTitle(weekday: number): string {
    const weekdayTitles = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    return weekdayTitles[weekday - 1];
  }

  getMonthShortName(month: number): string {
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return months[month - 1];
  }

  getMonthFullName(month: number): string {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day} de ${this.getMonthFullName(date.month)} de ${
      date.year
    }`;
  }
}
