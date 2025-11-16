package com.time2wish.time2wish_api.security; // Nouveau package pour la sécurité

import com.time2wish.time2wish_api.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    // 1. Clé Secrète (Définie dans application.properties)
    @Value("${app.jwtSecret}")
    private String jwtSecret;

    // 2. Durée de vie du Token (1 jour pour l'exemple)
    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    // 3. Clé JWT interne (sécurisée)
    private SecretKey key;

    // Initialisation sécurisée de la clé après l'injection des valeurs
    @PostConstruct
    protected void init() {
        // Décode la clé Base64 pour obtenir les octets
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Génère un Token JWT pour l'utilisateur authentifié.
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(user.getId()) // Le sujet est l'ID de l'utilisateur (UUID String)
                .claim("email", user.getEmail()) // Ajoutez des informations utiles dans les claims
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512) // Signature avec la clé secrète
                .compact();
    }
}