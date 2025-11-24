package com.time2wish.time2wish_api.security; // Nouveau package pour la sécurité

import com.time2wish.time2wish_api.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
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

    @Value("${app.accessTokenExpirationInMs}")
    private int accessTokenExpirationInMs; // Pour le Token d'accès

    @Value("${app.refreshTokenExpirationInMs}")
    private int refreshTokenExpirationInMs; // Pour le Token de rafraîchissement

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
                .setSubject(String.valueOf(user.getId())) // Le sujet est l'ID de l'utilisateur (UUID String)
                .claim("email", user.getEmail()) // Ajoutez des informations utiles dans les claims
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512) // Signature avec la clé secrète
                .compact();
    }

    /**
     * Génère l'Access Token (durée courte)
     */
    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpirationInMs);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("tokenType", "ACCESS") // Ajout du type de token
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Génère le Refresh Token (durée longue)
     */
    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationInMs);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("tokenType", "REFRESH") // Ajout du type de token
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    // Ajout d'une méthode pour l'expiration du cookie (en secondes)
    public int getRefreshTokenExpirationInSeconds() {
        return refreshTokenExpirationInMs / 1000;
    }

    /**
     * Valide un token JWT et retourne ses claims (données).
     * Utilisée par le filtre de sécurité pour les Access Tokens
     * et par le contrôleur pour les Refresh Tokens.
     *
     * @param token Le JWT à valider.
     * @return Les Claims (données) contenues dans le token.
     * @throws JwtException Si le token est invalide, expiré ou corrompu.
     */
    public Claims validateTokenAndGetClaims(String token) throws JwtException {
        // La librairie JJWT gère la validation de la signature et de l'expiration.
        return Jwts.parserBuilder()
                .setSigningKey(key) // Utilise la clé secrète pour vérifier la signature
                .build()
                .parseClaimsJws(token) // Tente de parser et valider le token signé (JWS)
                .getBody(); // Retourne les Claims si la validation réussit
    }

    /**
     * Extrait l'ID de l'utilisateur du token sans validation complète (à utiliser avec prudence).
     * Peut être utile dans le filtre de sécurité avant la validation complète.
     * * @param token Le JWT
     * @return L'ID de l'utilisateur (Subject)
     */
    public String getUserIdFromJWT(String token) {
        // NOTE: Ceci ne valide pas la signature ou l'expiration. Utilisez-le avec précaution.
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    /**
     * Extrait l'ID de l'utilisateur (le Subject) d'un objet Claims validé.
     */
    public String getUserIdFromClaims(Claims claims) {
        // Le Subject (Subject) du JWT est l'ID utilisateur que nous avons défini.
        return claims.getSubject();
    }
}