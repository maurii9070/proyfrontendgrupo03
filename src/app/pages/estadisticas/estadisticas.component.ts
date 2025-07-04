import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  EstadisticasService,
  ResumenEstadisticas,
} from '../../services/estadisticas.service';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css',
})
export class EstadisticasComponent implements OnInit {
  loading = true;
  error: string | null = null;

  // Datos del resumen
  resumen: ResumenEstadisticas | null = null;

  // Configuraciones de gráficos
  public especialidadesChartData: ChartConfiguration<'pie'>['data'] | null =
    null;
  public especialidadesChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Turnos por Especialidad',
      },
    },
  };

  public horariosChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public horariosChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Horarios Más Solicitados',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  public doctoresChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public doctoresChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Turnos por Doctor',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  public estadosChartData: ChartConfiguration<'doughnut'>['data'] | null = null;
  public estadosChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Estados de Turnos',
      },
    },
  };

  public mesChartData: ChartConfiguration<'line'>['data'] | null = null;
  public mesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Evolución de Turnos por Mes',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  public ingresosChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public ingresosChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Ingresos por Especialidad',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    try {
      this.loading = true;
      this.error = null;

      // Cargar todas las estadísticas en paralelo
      const [
        resumen,
        especialidades,
        horarios,
        doctores,
        estados,
        meses,
        ingresos,
      ] = await Promise.all([
        this.estadisticasService.getResumen().toPromise(),
        this.estadisticasService.getTurnosPorEspecialidad().toPromise(),
        this.estadisticasService.getHorariosMasSolicitados().toPromise(),
        this.estadisticasService.getTurnosPorDoctor().toPromise(),
        this.estadisticasService.getEstadosTurnos().toPromise(),
        this.estadisticasService.getTurnosPorMes().toPromise(),
        this.estadisticasService.getIngresosPorEspecialidad().toPromise(),
      ]);

      console.log('📊 Datos recibidos:', {
        resumen,
        especialidades,
        horarios,
        doctores,
        estados,
        meses,
        ingresos,
      });

      this.resumen = resumen!;
      this.especialidadesChartData = especialidades!.chartData;
      this.horariosChartData = horarios!.chartData;
      this.doctoresChartData = doctores!.chartData;
      this.estadosChartData = estados!.chartData;
      this.mesChartData = meses!.chartData;
      this.ingresosChartData = ingresos!.chartData;
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      this.error =
        'Error al cargar las estadísticas. Por favor, intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
