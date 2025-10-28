package com.time2wish.time2wish_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration // Ou sur la classe principale @SpringBootApplication
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // 1. Désactiver la protection CSRF pour les requêtes API (souvent nécessaire pour Postman)
                .csrf().disable()

                // 2. Définir les autorisations de requêtes
                .authorizeRequests()
                // Autoriser l'accès SANS AUTHENTIFICATION à ces chemins
                .antMatchers("/api/register", "/api/login", "/h2-console/**").permitAll()

                // Exiger l'authentification pour TOUTES les autres requêtes
                .anyRequest().authenticated()
                .and()
                // 3. DÉSactiver la protection des frames (pour que la console H2 puisse s'afficher dans une iframe)
                .headers().frameOptions().disable();
        // 3. Vous pouvez aussi désactiver la fenêtre de connexion basique par défaut si vous l'avez.
        // .and()
        // .httpBasic().disable();

        ; // Fin de la configuration
    }
}