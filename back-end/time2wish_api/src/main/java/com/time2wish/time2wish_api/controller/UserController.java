package com.time2wish.time2wish_api.controller;

import com.time2wish.time2wish_api.dto.*;
import com.time2wish.time2wish_api.model.User;
import com.time2wish.time2wish_api.model.Birthday;
import com.time2wish.time2wish_api.security.JwtTokenProvider;
import com.time2wish.time2wish_api.service.UserService;
import com.time2wish.time2wish_api.service.BirthdayService;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie; // Import pour les Cookies
import javax.servlet.http.HttpServletResponse; // Import pour la Réponse HTTP

import javax.servlet.http.HttpServletRequest; // Import nécessaire
import io.jsonwebtoken.Claims; // Import nécessaire pour lire les claims

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final BirthdayService birthdayService;
    private final JwtTokenProvider tokenProvider;

    /**
     * Injection de dépendances par constructeur (UserService et BirthdayService).
     */
    @Autowired
    public UserController(UserService userService, BirthdayService birthdayService, JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.birthdayService = birthdayService;
        this.tokenProvider = tokenProvider;
    }

    // =========================================================================
    // 🚪 Authentification & Enregistrement
    // =========================================================================

    /**
     * Enregistrement (Registration) d'un nouvel utilisateur.
     * POST /api/register
     * @param user - L'objet User (contenant le mot de passe brut dans passwordHash)
     * @return Le nouvel utilisateur créé (status 201 CREATED)
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User registerUser(@RequestBody User user) {
        // Le service gère le hachage du mot de passe et la définition du statut.
        return userService.registerUser(user);
    }

    /**
     * Connexion (Login) de l'utilisateur.
     * POST /api/login
     * @param credentials - Map contenant "email" et "password"
     * @return ResponseEntity avec un jeton/message de succès ou une erreur 401
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials,
                                   HttpServletResponse response) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> authenticatedUser = userService.authenticate(email, password);

        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();

            // 1. GÉNÉRATION DES DEUX TOKENS
            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);

            // 2. CRÉATION DU COOKIE (REFRESH TOKEN)
            String cookieValue = String.format("refreshToken=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=Lax",
                    refreshToken,
                    tokenProvider.getRefreshTokenExpirationInSeconds()); // Utiliser la durée longue

            response.addHeader("Set-Cookie", cookieValue);

            // 3. CRÉATION DU DTO DE RÉPONSE
            List<BirthdayDTO> birthdayDTOs = user.getBirthdays().stream()
                    .map(BirthdayDTO::fromEntity)
                    .collect(Collectors.toList());

            UserProfileDTO userProfileDTO = UserProfileDTO.fromUser(user);
            LoginDataDTO loginDataDTO = new LoginDataDTO(userProfileDTO);

            // 4. RETOURNER LA RÉPONSE avec l'ACCESS TOKEN (dans le corps)
            // Le champ 'token' dans le DTO sera renommé en 'accessToken' pour la clarté.
            LoginResponseDTO finalResponse = new LoginResponseDTO(true, accessToken, loginDataDTO);

            return ResponseEntity.ok(finalResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Email ou mot de passe invalide."));
        }
    }

    /**
     * Endpoint appelé par le Frontend lorsqu'un Access Token expire (401).
     * Il utilise le Refresh Token stocké dans le cookie.
     * POST /api/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {

        String refreshToken = null;

        // 1. Lire le Refresh Token du cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Refresh Token manquant. Veuillez vous reconnecter."));
        }

        try {
            // 2. Valider le Refresh Token et extraire les claims (données)
            Claims claims = tokenProvider.validateTokenAndGetClaims(refreshToken);

            // Optionnel : Vérifiez le type de token pour la sécurité (s'assurer que ce n'est pas un Access Token)
            String tokenType = claims.get("tokenType", String.class);
            if (!"REFRESH".equals(tokenType)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("message", "Token fourni n'est pas un Refresh Token."));
            }

            // 3. Récupérer l'ID utilisateur à partir des claims
            String userId = claims.getSubject();

            // 4. Récupérer l'utilisateur et générer un nouveau token...
            Optional<User> userOptional = userService.getUser(Long.valueOf(userId));

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Générer un NOUVEL Access Token
                String newAccessToken = tokenProvider.generateAccessToken(user);

                // Retourner le nouvel Access Token dans le corps
                return ResponseEntity.ok(Collections.singletonMap("accessToken", newAccessToken));
            }

        } catch (JwtException e) {
            // Le token est invalide (signature), expiré, ou mal formé.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Refresh Token invalide ou expiré."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "Utilisateur non trouvé."));
    }


    // =========================================================================
    // 👤 CRUD de base pour les Utilisateurs (/api/users)
    // =========================================================================

    /**
     * Récupère la liste de tous les utilisateurs.
     * GET /api/users
     * @return une liste itérable de tous les utilisateurs
     */
    @GetMapping("/users")
    public Iterable<User> getUsers() {
        return userService.getUsers();
    }

    /**
     * Récupère un utilisateur basé sur son ID (String UUID).
     * GET /api/users/{id}
     * @param id - ID (String) de l'utilisateur à récupérer
     * @return Un objet User ou null si non trouvé
     */
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") final Long id) {
        // Utilisation de String pour l'ID, corrigé.
        Optional<User> user = userService.getUser(id);
        return user.orElse(null);
    }

    /**
     * Met à jour un utilisateur existant basé sur son ID.
     * PUT /api/users/{id}
     * @param id - ID (String) de l'utilisateur à mettre à jour
     * @param userDetails - Les nouvelles données de l'utilisateur
     * @return L'objet User mis à jour, ou null si non trouvé
     */
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable("id") final Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userService.getUser(id);

        if (userOptional.isPresent()) {
            User userToUpdate = userOptional.get();

            // Mappage des champs modifiables (Exclure la modification du mot de passe brut ici)
            userToUpdate.setFullName(userDetails.getFullName());
            userToUpdate.setEmail(userDetails.getEmail());
            userToUpdate.setBio(userDetails.getBio());
            userToUpdate.setNotificationsEnabled(userDetails.getNotificationsEnabled());
            userToUpdate.setTheme(userDetails.getTheme());
            userToUpdate.setLanguage(userDetails.getLanguage());
            userToUpdate.setStatus(userDetails.getStatus());

            return userService.saveUser(userToUpdate);
        } else {
            return null; // Idéalement, retourner un 404 Not Found
        }
    }

    /**
     * Supprime un utilisateur basé sur son ID (Suppression de compte).
     * DELETE /api/users/{id}
     * @param id - ID (String) de l'utilisateur à supprimer
     */
    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retourne 204 No Content pour une suppression réussie
    public void deleteUser(@PathVariable("id") final Long id) {
        // Utilisation de String pour l'ID, corrigé.
        userService.deleteUser(id);
    }

    // =========================================================================
    // 🎂 Opérations Imbriquées : Gestion des Anniversaires de l'Utilisateur
    // =========================================================================

    /**
     * Met à jour un anniversaire spécifique appartenant à l'utilisateur.
     * PUT /api/users/{userId}/birthdays/{birthdayId}
     * @param userId - ID (String) du propriétaire de l'anniversaire
     * @param birthdayId - ID (Long) de l'anniversaire à mettre à jour
     * @param updatedBirthday - L'objet Birthday avec les nouvelles données
     * @return L'anniversaire mis à jour, ou null si la propriété n'est pas vérifiée.
     */
    @PutMapping("/users/{userId}/birthdays/{birthdayId}")
    public Birthday updateBirthdayForUser(
            @PathVariable("userId") final String userId,
            @PathVariable("birthdayId") final Long birthdayId,
            @RequestBody Birthday updatedBirthday)
    {
        Optional<Birthday> existingBirthdayOptional = birthdayService.getBirthday(birthdayId);

        if (existingBirthdayOptional.isPresent()) {
            Birthday birthdayToUpdate = existingBirthdayOptional.get();

            // VALIDATION: Vérifier que l'anniversaire appartient à l'utilisateur fourni (Sécurité)
            if (birthdayToUpdate.getUser() != null && birthdayToUpdate.getUser().getId().equals(userId)) {

                // Mise à jour des champs
                birthdayToUpdate.setName(updatedBirthday.getName());
                birthdayToUpdate.setEmail(updatedBirthday.getEmail());
                birthdayToUpdate.setCity(updatedBirthday.getCity());
                birthdayToUpdate.setCategory(updatedBirthday.getCategory());
                birthdayToUpdate.setDate(updatedBirthday.getDate());
                birthdayToUpdate.setPhoto(updatedBirthday.getPhoto());
                birthdayToUpdate.setPhone(updatedBirthday.getPhone());
                birthdayToUpdate.setNotes(updatedBirthday.getNotes());
                birthdayToUpdate.setPreferencies(updatedBirthday.getPreferencies());
                birthdayToUpdate.setEnableReminders(updatedBirthday.getEnableReminders());
                birthdayToUpdate.setPassed(updatedBirthday.getPassed());

                return birthdayService.saveBirthday(birthdayToUpdate);
            } else {
                return null; // Anniversaire trouvé, mais n'appartient pas à cet utilisateur (403 Forbidden ou 404 Not Found)
            }
        } else {
            return null; // Anniversaire non trouvé (404 Not Found)
        }
    }
}