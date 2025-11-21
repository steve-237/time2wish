import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // 1. Vérification de l'état de connexion local
    if (this.authService.isLoggedIn()) {
      // Si la session est active (le localStorage contient les données de l'utilisateur),
      // nous autorisons l'accès à la route.
      return true;
    }

    // 2. Si non connecté, redirection
    // L'utilisateur est redirigé vers la page de login.
    console.log('Accès refusé. Redirection vers la page de connexion.');
    this.router.navigate(['/login']);
    return false;
  }
}