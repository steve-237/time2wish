package com.time2wish.time2wish_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**") // Applique la règle à toutes les routes sous /api/

                // 1. Autoriser l'origine Angular
                .allowedOrigins("http://localhost:4200")

                // 2. Autoriser les méthodes HTTP utilisées (POST, GET, PUT, DELETE, OPTIONS)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                // 3. Autoriser les headers
                .allowedHeaders("*")

                // 4. Autoriser l'envoi de cookies/credentials si nécessaire (non nécessaire ici, mais bonne pratique)
                .allowCredentials(true);
    }
}