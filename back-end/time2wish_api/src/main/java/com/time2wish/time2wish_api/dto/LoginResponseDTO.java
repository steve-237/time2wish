package com.time2wish.time2wish_api.dto;

import lombok.Value;

@Value
public class LoginResponseDTO {
    private final Boolean success = true; // Indicateur de succès
    private final String token;
    private final LoginDataDTO data; // L'objet conteneur pour les données
}