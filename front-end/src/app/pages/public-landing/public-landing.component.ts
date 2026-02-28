import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { RegistrationComponent } from '../registration/registration.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { ThemeService } from '../../shared/services/theme/theme.service';

@Component({
  selector: 'app-public-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './public-landing.component.html',
})
export class PublicLandingComponent {
  private readonly dialog = inject(DialogService);
  readonly themeService = inject(ThemeService);
  readonly isDarkTheme = this.themeService.isDarkTheme;

  readonly features = [
    {
      icon: 'calendar_month',
      title: 'Gestion centralisée des anniversaires',
      description:
        'Ajoutez, modifiez et suivez les anniversaires de vos proches, collègues ou clients depuis un tableau unique.',
    },
    {
      icon: 'notifications_active',
      title: 'Alertes intelligentes',
      description:
        'Recevez des rappels avant chaque événement pour ne jamais rater une date importante.',
    },
    {
      icon: 'dashboard_customize',
      title: 'Vue table et vue cartes',
      description:
        'Naviguez facilement entre une vue détaillée et une vue visuelle selon votre façon de travailler.',
    },
    {
      icon: 'language',
      title: 'Expérience multilingue',
      description:
        'L’application prend en charge plusieurs langues pour une adoption rapide dans des équipes internationales.',
    },
    {
      icon: 'history',
      title: 'Traçabilité des actions',
      description:
        'Consultez les logs d’activité pour garder un historique des mises à jour importantes.',
    },
    {
      icon: 'security',
      title: 'Sécurité et accès contrôlé',
      description:
        'Authentification dédiée, gestion utilisateur et navigation protégée pour vos données sensibles.',
    },
  ];

  readonly reasons = [
    'Gagner du temps avec une interface claire et moderne.',
    'Améliorer la relation avec vos proches, clients ou équipes grâce à une meilleure anticipation.',
    'Éviter les oublis grâce à des rappels contextualisés.',
    'Uniformiser le suivi des événements dans une seule plateforme.',
  ];

  readonly targetAudience = [
    'Particuliers qui souhaitent gérer les anniversaires familiaux.',
    'Assistants administratifs et RH qui gèrent les événements d’équipe.',
    'Managers commerciaux qui entretiennent la relation client.',
    'Associations et communautés avec des membres nombreux.',
  ];

  readonly interfaces = [
    {
      title: 'Écran de connexion',
      description: 'Un accès simple, sécurisé et rapide à votre espace personnel.',
      image: 'assets/img/interface-login.svg',
    },
    {
      title: 'Tableau de bord principal',
      description: 'Vue complète des anniversaires à venir, passés, et des actions disponibles.',
      image: 'assets/img/interface-dashboard.svg',
    },
    {
      title: 'Centre de notifications',
      description: 'Concentrez vos rappels et priorités dans une interface dédiée.',
      image: 'assets/img/interface-notifications.svg',
    },
  ];

  openRegistrationModal(): void {
    this.dialog.open(RegistrationComponent, { width: '620px' });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
