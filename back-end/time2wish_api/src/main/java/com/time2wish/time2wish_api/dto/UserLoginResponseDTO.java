package com.time2wish.time2wish_api.dto;

import com.time2wish.time2wish_api.model.User;
import lombok.Value;

import java.util.List;
import java.util.stream.Collectors; // NOUVEL IMPORT

@Value
public class UserLoginResponseDTO {

    private final String message = "Connexion réussie";
    private final String token;

    // Informations utilisateur
    private final String id;
    private final String fullName;
    private final String email;
    private final String profilePicture;
    private final String theme;
    private final String language;
    private final Boolean notificationsEnabled;
    private final String status;

    // NOUVEAU CHAMP
    private final List<BirthdayDTO> birthdays;


    public static UserLoginResponseDTO fromUser(User user, String token) {
        // Conversion de List<Birthday> en List<BirthdayDTO>
        List<BirthdayDTO> birthdayDTOs = user.getBirthdays().stream()
                .map(BirthdayDTO::fromEntity) // Utilise la méthode de conversion du DTO
                .collect(Collectors.toList());

        return new UserLoginResponseDTO(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getTheme().name(),
                user.getLanguage(),
                user.getNotificationsEnabled(),
                user.getStatus().name(),
                birthdayDTOs // Inclure la liste des DTOs
        );
    }
}