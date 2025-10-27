package com.time2wish.time2wish_api.model;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;

@Data
@Entity
@Table(name = "users") // Le nom de la table est maintenant "users"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // UUID est souvent préféré pour les clés primaires d'utilisateur
    private String id;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Lob // Pour les chaînes de caractères potentiellement longues
    private String bio;

    @Column(name = "notifications_enabled", nullable = false)
    private Boolean notificationsEnabled;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Birthday> birthdays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Theme theme;

    @Column(nullable = false)
    private String language;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    // --- Enums pour Theme et Status ---

    public enum Theme {
        LIGHT, DARK, SYSTEM
        // Ajoutez d'autres thèmes si nécessaire
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, PENDING
    }

    // --- Méthodes de cycle de vie (optionnel mais recommandé) ---

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.status == null) {
            this.status = UserStatus.PENDING; // Statut par défaut
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}