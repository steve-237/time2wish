package com.time2wish.time2wish_api.service;

import com.time2wish.time2wish_api.model.User;
import com.time2wish.time2wish_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Nécessite la dépendance Spring Security
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    /**
     * Injection des dépendances par constructeur.
     */
    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

// =========================================================================
// Méthodes Privées (Simulations)
// =========================================================================

    /**
     * Simule la vérification que le mot de passe respecte les exigences.
     */
    private void validatePasswordSecurity(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caractères.");
        }

        if (!password.matches(".*[!@#$%^&*()].*")) {
            throw new IllegalArgumentException("Le mot de passe doit contenir un caractère spécial.");
        }
    }

    /**
     * Simule l'envoi de l'email de confirmation à l'utilisateur.
     */
    private void sendConfirmationEmail(User user) {
        // Dans une application réelle, cette méthode utiliserait JavaMailSender
        // pour envoyer un lien contenant le token de vérification.
        System.out.println("SIMULATION: Envoi d'un email de confirmation à " + user.getEmail() +
                " pour activer le compte.");
    }

    // =========================================================================
    // Opérations d'Authentification et d'Enregistrement
    // =========================================================================

    // NOTE: Nécessite que le UserRepository ait la méthode findByEmail(String email)
// NOTE: Nécessite que le statut PENDING existe dans l'Enum User.UserStatus

    /**
     * Enregistre un nouvel utilisateur, après validation et envoi d'un email de confirmation.
     * Le compte est créé en statut PENDING.
     * @param user - L'objet User (le mot de passe brut est dans le champ passwordHash).
     * @return L'objet User sauvegardé.
     * @throws IllegalArgumentException si l'email est déjà utilisé ou si le mot de passe est invalide.
     */
    @Transactional
    public User registerUser(User user) {
        System.out.print(user);
        // 1. ✅ Validation de l'email unique
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("L'adresse email est déjà utilisée.");
        }

        // 2. ✅ Validation du mot de passe (SIMULATION)
        // C'est ici que vous intégrerez votre logique de validation de mot de passe.
        // Pour l'exemple, nous allons créer une méthode utilitaire simulée.
        validatePasswordSecurity(user.getPassword());

        // 3. 🔐 Sécurité: Hacher le mot de passe brut
        String rawPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(rawPassword));

        // 4. ✅ Définir le statut initial: PENDING
        user.setStatus(User.UserStatus.PENDING);

        // NOTE: Il serait pertinent de générer ici un jeton de vérification (verificationToken)
        // et de l'ajouter à l'entité User pour le processus de confirmation par email.

        // 5. Sauvegarder l'utilisateur (création du compte PENDING)
        User createdUser = userRepository.save(user);
        System.out.println("CreatedUser : " + createdUser);

        // 6. ✅ Envoi d'email de confirmation (SIMULATION)
        sendConfirmationEmail(createdUser);

        return createdUser;
    }

    /**
     * Authentifie un utilisateur en vérifiant l'email et le mot de passe brut.
     * @param email - L'email de l'utilisateur.
     * @param rawPassword - Le mot de passe non haché.
     * @return Optional contenant l'utilisateur si authentification réussie, Optional vide sinon.
     */
    @Transactional // Assurez que la session JPA est ouverte
    public Optional<User> authenticate(String email, String rawPassword) {
        // 1. Chercher l'utilisateur par email
        Optional<User> userOptional = userRepository.findByEmailWithBirthdays(email);
        System.out.println("UserOptional : " + userOptional);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (passwordEncoder.matches(rawPassword, user.getPassword())) {

                // Force l'initialisation de la liste AVANT la fin de la méthode
                // Cela évite la LazyInitializationException.
                user.getBirthdays().size();

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

    /**
     * Met à jour les détails d'un utilisateur existant.
     * @param userId L'ID de l'utilisateur à modifier (doit correspondre à l'ID du token).
     * @param updatedDetails Un objet User contenant les champs à modifier.
     * @return L'utilisateur mis à jour.
     */
    public User updateUserDetails(final Long userId, User updatedDetails) {
        // 1. Trouver l'utilisateur existant ou lever une exception
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));

        // 2. Mettre à jour uniquement les champs non-nulls fournis (PATCH-like behavior)
        if (updatedDetails.getFullName() != null) {
            existingUser.setFullName(updatedDetails.getFullName());
        }
        if (updatedDetails.getEmail() != null) {
            // Note: Si vous permettez de changer l'email, vous devez gérer la complexité
            // de la vérification de l'unicité et potentiellement de la re-vérification de l'email.
            // Pour l'instant, on se contente de le mettre à jour.
            existingUser.setEmail(updatedDetails.getEmail());
        }
        if (updatedDetails.getBio() != null) {
            existingUser.setBio(updatedDetails.getBio());
        }
        // ... (Ajouter d'autres champs comme le thème si nécessaire)

        // 3. Sauvegarder et retourner
        return userRepository.save(existingUser);
    }

    public void createPasswordResetToken(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            emailService.sendResetPasswordEmail(user.getEmail(), token);
        });
    }

    public void updatePassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .filter(u -> u.getResetTokenExpiry().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new RuntimeException("Token invalide ou expiré"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}