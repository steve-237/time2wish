package com.time2wish.time2wish_api.service;

import com.time2wish.time2wish_api.model.User;
import com.time2wish.time2wish_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Nécessite la dépendance Spring Security
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Injection des dépendances par constructeur.
     */
    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================================
    // Opérations d'Authentification et d'Enregistrement
    // =========================================================================

    /**
     * Enregistre un nouvel utilisateur après avoir haché son mot de passe.
     * @param user - L'objet User (le mot de passe brut est dans le champ passwordHash).
     * @return L'objet User sauvegardé.
     */
    public User registerUser(User user) {
        // 1. Hacher le mot de passe brut
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // 2. Définir le statut initial (si non spécifié par la requête)
        if (user.getStatus() == null) {
            user.setStatus(User.UserStatus.ACTIVE);
        }

        // 3. Sauvegarder l'utilisateur (les horodatages sont gérés par @PrePersist)
        return userRepository.save(user);
    }

    /**
     * Authentifie un utilisateur en vérifiant l'email et le mot de passe brut.
     * @param email - L'email de l'utilisateur.
     * @param rawPassword - Le mot de passe non haché.
     * @return Optional contenant l'utilisateur si authentification réussie, Optional vide sinon.
     */
    public Optional<User> authenticate(String email, String rawPassword) {
        // 1. Chercher l'utilisateur par email (nécessite UserRepository.findByEmail)
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 2. Comparer le mot de passe brut avec le hachage stocké
            if (passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
                // Mettre à jour l'horodatage de la dernière connexion (bonne pratique)
                user.setLastLoginAt(Instant.now());
                userRepository.save(user);
                return userOptional;
            }
        }
        return Optional.empty();
    }

    // =========================================================================
    // Opérations CRUD de base
    // =========================================================================

    /**
     * Récupère un utilisateur basé sur son ID (UUID String).
     * @param id - de l'utilisateur
     * @return Un Optional contenant l'objet User
     */
    public Optional<User> getUser(final Long id) {
        return userRepository.findById(id);
    }

    /**
     * Récupère la liste de tous les utilisateurs.
     * @return un iterable list of all users
     */
    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    /**
     * Supprime un utilisateur.
     * @param id de l'utilisateur à supprimer (UUID String)
     */
    public void deleteUser(final Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Sauvegarde ou met à jour un utilisateur dans la base de données.
     * NOTE: Cette méthode ne doit pas être utilisée pour la mise à jour du mot de passe.
     * @param user - utilisateur à sauvegarder
     * @return l'objet User sauvegardé
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}