package com.time2wish.time2wish_api.dto;

import lombok.Value;

@Value
public class LoginResponseDTO {
    private final Boolean success;
    private final String token;
    private final LoginDataDTO data;
}