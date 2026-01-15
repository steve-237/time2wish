package com.time2wish.time2wish_api.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Simple DTO pour envoyer des messages de confirmation au frontend.
 */
@Setter
@Getter
public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

}
