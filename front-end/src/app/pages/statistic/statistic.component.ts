import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslocoModule, BaseChartDirective],
  templateUrl: './statistic.component.html',
})
export class StatisticComponent implements OnInit {
  // Données factices pour l'exemple
  stats = {
    totalBirthdays: 42,
    thisMonth: 5,
    upcomingSevenDays: 2,
    mostCommonSign: 'Lion'
  };

  // Configuration du graphique (Répartition par mois)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        data: [2, 5, 3, 8, 4, 6, 2, 4, 7, 3, 5, 2],
        label: 'Anniversaires',
        fill: true,
        tension: 0.4,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor() {}

  ngOnInit(): void {}
}