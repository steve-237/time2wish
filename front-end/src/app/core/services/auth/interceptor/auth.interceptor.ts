import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    // Injecter le service d'authentification pour obtenir le token
    const authService = inject(AuthService); 
    
    // NOTE: L'Access Token doit être stocké en mémoire ou dans le sessionStorage (PAS localStorage pour la sécurité)
    const accessToken = authService.getAccessToken();

    // 1. Si nous avons un token, nous le clonons et l'ajoutons
    if (accessToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
            // Retirez withCredentials si vous utilisez le Header Authorization, 
            // mais gardez-le si vous avez besoin des cookies (pour le Refresh Token)
            // withCredentials: true 
        });
    }

    // 2. Continuer la requête avec l'en-tête modifié ou non
    return next(req);
};