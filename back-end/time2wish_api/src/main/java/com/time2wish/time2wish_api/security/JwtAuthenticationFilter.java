package com.time2wish.time2wish_api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

// Nouveaux imports nécessaires pour la journalisation
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Filtre personnalisé pour intercepter les requêtes HTTP et valider le JWT.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtTokenProvider tokenProvider;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 🚨 1. COMPLÉTION: Injection manuelle du Bean tokenProvider
        // Cette méthode est utilisée car les filtres ne sont pas toujours gérés par l'injection @Autowired.
        if (this.tokenProvider == null) {
            ServletContext servletContext = request.getServletContext();
            ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
            if (applicationContext != null) {
                // Obtenir le Bean du contexte de l'application
                this.tokenProvider = applicationContext.getBean(JwtTokenProvider.class);
            }
        }

        // Si le tokenProvider n'a pas pu être injecté, on continue la chaîne (la requête échouera plus tard).
        if (this.tokenProvider == null) {
            logger.warn("JwtTokenProvider n'a pas pu être injecté. Les requêtes sécurisées échoueront.");
            filterChain.doFilter(request, response);
            return;
        }
        // Fin de l'injection manuelle.

        try {
            // 2. Extraire l'Access Token (depuis le cookie)
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                logger.debug("Access Token trouvé dans le header. Tentative de validation...");

                // 3. Valider le JWT et obtenir les Claims
                Claims claims = tokenProvider.validateTokenAndGetClaims(jwt);
                String userId = tokenProvider.getUserIdFromClaims(claims);
                String tokenType = claims.get("tokenType", String.class);

                if (!"ACCESS".equals(tokenType)) {
                    logger.warn("Token trouvé, mais type invalide: {}", tokenType);
                    filterChain.doFilter(request, response);
                    return;
                }

                // 4. COMPLÉTION: Authentifier l'utilisateur dans le contexte de sécurité
                // Le principal (premier argument) est l'ID utilisateur. Les autorités sont laissées vides pour le moment.
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Placement de l'objet Authentication dans le contexte
                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.info("Utilisateur authentifié avec succès. ID: {}", userId);

            } else {
                logger.debug("Aucun Access Token trouvé dans les cookies.");
            }
        } catch (JwtException ex) {
            // Le token est invalide, expiré ou corrompu.
            logger.error("Échec de l'authentification JWT pour la requête {}: {}", request.getRequestURI(), ex.getMessage());
        }

        // 5. Continuer la chaîne de filtres
        filterChain.doFilter(request, response);
    }

    // --- Méthode d'extraction du JWT à partir des Cookies (inchangée) ---

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Retourne la chaîne après "Bearer "
        }
        return null;
    }
}