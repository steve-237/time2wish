package com.time2wish.time2wish_api.dto;

import com.time2wish.time2wish_api.model.Birthday;
import lombok.Value;

import java.time.LocalDate;

@Value
public class BirthdayDTO {

    private final Long id;
    private final String name;
    private final LocalDate date;
    private final String category;
    private final Boolean enableReminders;
    // Ajoutez tous les autres champs nécessaires à l'UI

    // Méthode utilitaire pour convertir l'Entité en DTO
    public static BirthdayDTO fromEntity(Birthday birthday) {
        return new BirthdayDTO(
                birthday.getId(),
                birthday.getName(),
                birthday.getDate(),
                birthday.getCategory(),
                birthday.getEnableReminders()
        );
    }
}