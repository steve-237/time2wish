import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslocoModule, BaseChartDirective],
  templateUrl: './statistic.component.html',
})
export class StatisticComponent implements OnInit {


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

  stats = {
    totalBirthdays: 42,
    thisMonth: 5,
    upcomingSevenDays: 2,
    mostCommonSign: 'Lion',
    averageAge: 28,
    completionRate: 85, // % de profils avec toutes les infos
    topNames: ['Marie', 'Jean', 'Sophie'],
    ageRanges: { '0-18': 5, '19-35': 20, '36-60': 12, '60+': 5 }
  };

  // Répartition par genre (Doughnut)
  public genderChartData: ChartData<'doughnut'> = {
    labels: ['Femmes', 'Hommes', 'Non-spécifié'],
    datasets: [{
      data: [22, 18, 2],
      backgroundColor: ['#e91e63', '#2196f3', '#9e9e9e']
    }]
  };

  // Répartition par Signes Astrologiques (Polar Area)
  public zodiacChartData: ChartData<'polarArea'> = {
    labels: ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge'],
    datasets: [{
      data: [4, 6, 3, 5, 8, 2],
      backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)']
    }]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  
today: string | number | Date | undefined;

  constructor() {}

  ngOnInit(): void {}
}