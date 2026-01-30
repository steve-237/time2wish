import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslocoModule],
  templateUrl: './pricing.component.html',
})
export class PricingComponent {
  pricingPlans = [
    {
      name: 'Gratuit',
      price: '0',
      description: 'Parfait pour ne plus jamais oublier un anniversaire proche.',
      features: ['Jusqu\'à 10 anniversaires', 'Rappels par Email', 'Support communautaire'],
      buttonText: 'Commencer gratuitement',
      highlight: false
    },
    {
      name: 'Pro',
      price: '4.99',
      description: 'Pour ceux qui veulent offrir les meilleurs cadeaux.',
      features: ['Anniversaires illimités', 'Rappels SMS & Push', 'Idées cadeaux IA', 'Gestion de liste de souhaits'],
      buttonText: 'Essayer Pro',
      highlight: true // Ce plan sera mis en avant
    },
    {
      name: 'Famille',
      price: '12.99',
      description: 'Partagez la joie avec tout votre entourage.',
      features: ['Comptes partagés (5 pers.)', 'Calendrier familial commun', 'Support prioritaire 24/7', 'Sans publicités'],
      buttonText: 'Choisir Famille',
      highlight: false
    }
  ];
}