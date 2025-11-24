package com.time2wish.time2wish_api.dto;

import com.time2wish.time2wish_api.model.User;
import lombok.Value;

import java.util.List;
import java.util.stream.Collectors;

@Value
public class UserProfileDTO {
    private final Long id;
    private final String fullName;
    private final String email;
    private final String profilePicture;
    private final String bio;
    private final String theme;
    private final String language;
    private final Boolean notificationsEnabled;
    private final String status;
    // Clé 'birthday' (liste des anniversaires)
    private final List<BirthdayDTO> birthdays;

    public static UserProfileDTO fromUser(User user) {

        // CRÉATION DU DTO DE RÉPONSE pour la liste des anniversaire associe au user
        List<BirthdayDTO> birthdayDTOs = user.getBirthdays().stream()
                .map(BirthdayDTO::fromEntity) // Utilise la méthode de conversion du DTO
                .collect(Collectors.toList());

        return new UserProfileDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getBio(),
                user.getTheme().name(),
                user.getLanguage(),
                user.getNotificationsEnabled(),
                user.getStatus().name(),
                birthdayDTOs
        );
    }
}