package com.time2wish.time2wish_api.controller;

import com.time2wish.time2wish_api.model.User;
import com.time2wish.time2wish_api.model.Birthday;
import com.time2wish.time2wish_api.service.UserService;
import com.time2wish.time2wish_api.service.BirthdayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final BirthdayService birthdayService;

    /**
     * Injection de dépendances par constructeur (UserService et BirthdayService).
     */
    @Autowired
    public UserController(UserService userService, BirthdayService birthdayService) {
        this.userService = userService;
        this.birthdayService = birthdayService;
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
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email et mot de passe requis."));
        }

        Optional<User> authenticatedUser = userService.authenticate(email, password);

        if (authenticatedUser.isPresent()) {
            // Dans une application réelle sécurisée, vous généreriez un JWT ici.
            String mockToken = "SIMULATED_JWT_FOR_USER_" + authenticatedUser.get().getId();

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Connexion réussie");
            responseBody.put("userId", authenticatedUser.get().getId());
            responseBody.put("token", mockToken);

            return ResponseEntity.ok(responseBody);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Email ou mot de passe invalide."));
        }
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