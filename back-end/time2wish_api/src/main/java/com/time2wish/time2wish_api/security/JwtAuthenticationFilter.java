package com.time2wish.time2wish_api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.context.ApplicationContext; // Import nécessaire
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.context.support.WebApplicationContextUtils; // Import nécessaire
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

/**
 * Filtre personnalisé pour intercepter les requêtes HTTP et valider le JWT.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtTokenProvider tokenProvider; // Retiré l'annotation @Autowired

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 🚨 1. CORRECTION: Injection manuelle du Bean tokenProvider
        if (tokenProvider == null) {
            ServletContext servletContext = request.getServletContext();
            ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
            if (applicationContext != null) {
                this.tokenProvider = applicationContext.getBean(JwtTokenProvider.class);
            }
        }

        // Si le tokenProvider n'a pas pu être injecté, on continue la chaîne (la requête échouera plus tard).
        if (this.tokenProvider == null) {
            filterChain.doFilter(request, response);
            return;
        }
        // Fin de l'injection manuelle.

        try {
            // 2. Extraire l'Access Token (depuis le cookie)
            String jwt = getJwtFromCookies(request, "access_token");

            if (StringUtils.hasText(jwt)) {

                // 3. Valider le JWT et obtenir les Claims
                Claims claims = tokenProvider.validateTokenAndGetClaims(jwt);
                String userId = tokenProvider.getUserIdFromClaims(claims); // Utilisation de la méthode corrigée

                String tokenType = claims.get("tokenType", String.class);
                if (!"ACCESS".equals(tokenType)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // 4. Authentifier l'utilisateur
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (JwtException ex) {
            logger.error("JWT non valide ou expiré : " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // --- Méthode d'extraction du JWT à partir des Cookies ---

    private String getJwtFromCookies(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}