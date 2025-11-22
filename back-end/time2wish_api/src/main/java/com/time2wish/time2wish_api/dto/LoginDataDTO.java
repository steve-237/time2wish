package com.time2wish.time2wish_api.dto;

import lombok.Value;

import java.util.List;

@Value
public class LoginDataDTO {
    // Clé 'user'
    private final UserProfileDTO user;
}