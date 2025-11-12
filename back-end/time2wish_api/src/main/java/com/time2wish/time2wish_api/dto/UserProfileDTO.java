package com.time2wish.time2wish_api.dto;

import com.time2wish.time2wish_api.model.User;
import lombok.Value;

@Value
public class UserProfileDTO {
    private final String id;
    private final String fullName;
    private final String email;
    private final String profilePicture;
    private final String bio;
    private final String theme;
    private final String language;
    private final Boolean notificationsEnabled;
    private final String status;

    public static UserProfileDTO fromUser(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getBio(),
                user.getTheme().name(),
                user.getLanguage(),
                user.getNotificationsEnabled(),
                user.getStatus().name()
        );
    }
}