package com.time2wish.time2wish_api.config;

import com.time2wish.time2wish_api.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy; // Import pour la politique de session
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Pour insérer notre filtre

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    // --- Beans de Sécurité ---

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Déclaration du filtre JWT comme un Bean pour qu'il puisse être injecté.
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    // --- Configuration des Règles HTTP et des Filtres ---

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // 1. Désactiver la protection CSRF
                // Nécessaire pour les API REST qui utilisent des tokens ou des cookies (avec CORS)
                .csrf().disable()

                // 2. Configurer CORS
                // Votre CorsConfig.java gère déjà les règles, il suffit d'activer
                .cors()

                .and()
                // 3. Configurer la gestion des sessions
                // Le JWT est sans état (Stateless), nous désactivons la gestion des sessions
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                // 4. Définir les autorisations de requêtes
                .authorizeRequests()

                // Routes Publiques (Accessibles sans token)
                .antMatchers(
                        "/api/register",
                        "/api/login",
                        "/api/logout",
                        "/api/refresh", // Endpoint pour rafraîchir le token
                        "/h2-console/**" // Console H2
                ).permitAll()

                // Exiger l'authentification (via le filtre JWT) pour toutes les autres requêtes
                // ATTENTION: J'ai retiré "/api/users/**" de permitAll() pour le protéger !
                .anyRequest().authenticated()

                .and()
                // 5. Désactiver la protection des frames (pour H2)
                .headers().frameOptions().disable();

        // 6. INSTALLER LE FILTRE JWT
        // Nous ajoutons notre filtre JUSTE AVANT le filtre standard de Spring.
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}