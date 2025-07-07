import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  EstadisticasService,
  ResumenEstadisticas,
} from '../../services/estadisticas.service';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css',
})
export class EstadisticasComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error: string | null = null;

  // Referencias a los canvas
  @ViewChild('especialidadesChart', { static: false })
  especialidadesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('horariosChart', { static: false })
  horariosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doctoresChart', { static: false })
  doctoresChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('estadosChart', { static: false })
  estadosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mesChart', { static: false })
  mesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosChart', { static: false })
  ingresosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('diaSemanaChart', { static: false })
  diaSemanaChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosMesChart', { static: false })
  ingresosMesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topDoctoresChart', { static: false })
  topDoctoresChart!: ElementRef<HTMLCanvasElement>;

  // Instancias de los gráficos
  private especialidadesChartInstance: Chart | null = null;
  private horariosChartInstance: Chart | null = null;
  private doctoresChartInstance: Chart | null = null;
  private estadosChartInstance: Chart | null = null;
  private mesChartInstance: Chart | null = null;
  private ingresosChartInstance: Chart | null = null;
  private diaSemanaChartInstance: Chart | null = null;
  private ingresosMesChartInstance: Chart | null = null;
  private topDoctoresChartInstance: Chart | null = null;

  // Datos del resumen
  resumen: ResumenEstadisticas | null = null;

  // Datos de los gráficos
  public especialidadesChartData: ChartConfiguration<'pie'>['data'] | null =
    null;
  public horariosChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public doctoresChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public estadosChartData: ChartConfiguration<'doughnut'>['data'] | null = null;
  public mesChartData: ChartConfiguration<'line'>['data'] | null = null;
  public ingresosChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public diaSemanaChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public ingresosMesChartData: ChartConfiguration<'line'>['data'] | null = null;
  public topDoctoresChartData: ChartConfiguration<'bar'>['data'] | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ngAfterViewInit() {
    // Este método se ejecuta después de que la vista se haya inicializado
    // Los gráficos se crearán cuando tengamos los datos
  }

  private destroyCharts() {
    // Destruir gráficos existentes antes de crear nuevos
    if (this.especialidadesChartInstance) {
      this.especialidadesChartInstance.destroy();
      this.especialidadesChartInstance = null;
    }
    if (this.horariosChartInstance) {
      this.horariosChartInstance.destroy();
      this.horariosChartInstance = null;
    }
    if (this.doctoresChartInstance) {
      this.doctoresChartInstance.destroy();
      this.doctoresChartInstance = null;
    }
    if (this.estadosChartInstance) {
      this.estadosChartInstance.destroy();
      this.estadosChartInstance = null;
    }
    if (this.mesChartInstance) {
      this.mesChartInstance.destroy();
      this.mesChartInstance = null;
    }
    if (this.ingresosChartInstance) {
      this.ingresosChartInstance.destroy();
      this.ingresosChartInstance = null;
    }
    if (this.diaSemanaChartInstance) {
      this.diaSemanaChartInstance.destroy();
      this.diaSemanaChartInstance = null;
    }
    if (this.ingresosMesChartInstance) {
      this.ingresosMesChartInstance.destroy();
      this.ingresosMesChartInstance = null;
    }
    if (this.topDoctoresChartInstance) {
      this.topDoctoresChartInstance.destroy();
      this.topDoctoresChartInstance = null;
    }
  }

  private createCharts() {
    // Crear gráficos solo si los datos están disponibles y las referencias existen
    setTimeout(() => {
      if (this.especialidadesChartData && this.especialidadesChart) {
        this.createEspecialidadesChart();
      }
      if (this.horariosChartData && this.horariosChart) {
        this.createHorariosChart();
      }
      if (this.doctoresChartData && this.doctoresChart) {
        this.createDoctoresChart();
      }
      if (this.estadosChartData && this.estadosChart) {
        this.createEstadosChart();
      }
      if (this.mesChartData && this.mesChart) {
        this.createMesChart();
      }
      if (this.ingresosChartData && this.ingresosChart) {
        this.createIngresosChart();
      }
      if (this.diaSemanaChartData && this.diaSemanaChart) {
        this.createDiaSemanaChart();
      }
      if (this.ingresosMesChartData && this.ingresosMesChart) {
        this.createIngresosMesChart();
      }
      if (this.topDoctoresChartData && this.topDoctoresChart) {
        this.createTopDoctoresChart();
      }
    }, 100);
  }

  private createEspecialidadesChart() {
    if (this.especialidadesChart && this.especialidadesChartData) {
      this.especialidadesChartInstance = new Chart(
        this.especialidadesChart.nativeElement,
        {
          type: 'pie',
          data: this.especialidadesChartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Turnos por Especialidad',
              },
            },
          },
        }
      );
    }
  }

  private createHorariosChart() {
    if (this.horariosChart && this.horariosChartData) {
      this.horariosChartInstance = new Chart(this.horariosChart.nativeElement, {
        type: 'bar',
        data: this.horariosChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
        },
      });
    }
  }

  private createDoctoresChart() {
    if (this.doctoresChart && this.doctoresChartData) {
      this.doctoresChartInstance = new Chart(this.doctoresChart.nativeElement, {
        type: 'bar',
        data: this.doctoresChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
        },
      });
    }
  }

  private createEstadosChart() {
    if (this.estadosChart && this.estadosChartData) {
      this.estadosChartInstance = new Chart(this.estadosChart.nativeElement, {
        type: 'doughnut',
        data: this.estadosChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Distribución de Estados de Turnos',
            },
          },
        },
      });
    }
  }

  private createMesChart() {
    if (this.mesChart && this.mesChartData) {
      this.mesChartInstance = new Chart(this.mesChart.nativeElement, {
        type: 'line',
        data: this.mesChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
        },
      });
    }
  }

  private createIngresosChart() {
    if (this.ingresosChart && this.ingresosChartData) {
      this.ingresosChartInstance = new Chart(this.ingresosChart.nativeElement, {
        type: 'bar',
        data: this.ingresosChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
                  return '$' + (value as number).toLocaleString();
                },
              },
            },
          },
        },
      });
    }
  }

  private createDiaSemanaChart() {
    if (this.diaSemanaChart && this.diaSemanaChartData) {
      this.diaSemanaChartInstance = new Chart(
        this.diaSemanaChart.nativeElement,
        {
          type: 'bar',
          data: this.diaSemanaChartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
              },
              title: {
                display: true,
                text: 'Turnos por Día de la Semana',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        }
      );
    }
  }

  private createIngresosMesChart() {
    if (this.ingresosMesChart && this.ingresosMesChartData) {
      this.ingresosMesChartInstance = new Chart(
        this.ingresosMesChart.nativeElement,
        {
          type: 'line',
          data: this.ingresosMesChartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
              },
              title: {
                display: true,
                text: 'Ingresos por Mes',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Ingresos ($)',
                },
                ticks: {
                  callback: function (value) {
                    return '$' + (value as number).toLocaleString();
                  },
                },
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Cantidad de Turnos',
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          },
        }
      );
    }
  }

  private createTopDoctoresChart() {
    if (this.topDoctoresChart && this.topDoctoresChartData) {
      this.topDoctoresChartInstance = new Chart(
        this.topDoctoresChart.nativeElement,
        {
          type: 'bar',
          data: this.topDoctoresChartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Gráfico horizontal
            plugins: {
              legend: {
                display: true,
              },
              title: {
                display: true,
                text: 'Top Doctores Más Solicitados',
              },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
            },
          },
        }
      );
    }
  }

  async cargarEstadisticas() {
    try {
      this.loading = true;
      this.error = null;

      // Destruir gráficos existentes
      this.destroyCharts();

      // Cargar todas las estadísticas en paralelo
      const [
        resumen,
        especialidades,
        horarios,
        doctores,
        estados,
        meses,
        ingresos,
        diaSemana,
        ingresosMes,
        topDoctores,
      ] = await Promise.all([
        this.estadisticasService.getResumen().toPromise(),
        this.estadisticasService.getTurnosPorEspecialidad().toPromise(),
        this.estadisticasService.getHorariosMasSolicitados().toPromise(),
        this.estadisticasService.getTurnosPorDoctor().toPromise(),
        this.estadisticasService.getEstadosTurnos().toPromise(),
        this.estadisticasService.getTurnosPorMes().toPromise(),
        this.estadisticasService.getIngresosPorEspecialidad().toPromise(),
        this.estadisticasService.getTurnosPorDiaSemana().toPromise(),
        this.estadisticasService.getIngresosPorMes().toPromise(),
        this.estadisticasService.getTopDoctoresSolicitados().toPromise(),
      ]);

      console.log('📊 Datos recibidos:', {
        resumen,
        especialidades,
        horarios,
        doctores,
        estados,
        meses,
        ingresos,
        diaSemana,
        ingresosMes,
        topDoctores,
      });

      this.resumen = resumen!;
      this.especialidadesChartData = especialidades!.chartData;
      this.horariosChartData = horarios!.chartData;
      this.doctoresChartData = doctores!.chartData;
      this.estadosChartData = estados!.chartData;
      this.mesChartData = meses!.chartData;
      this.ingresosChartData = ingresos!.chartData;
      this.diaSemanaChartData = diaSemana!.chartData;
      this.ingresosMesChartData = ingresosMes!.chartData;
      this.topDoctoresChartData = topDoctores!.chartData;

      // Crear los gráficos después de cargar los datos
      this.createCharts();
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      this.error =
        'Error al cargar las estadísticas. Por favor, intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    // Limpiar los gráficos al destruir el componente
    this.destroyCharts();
  }
}
