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
    private final String photo;
    private final String city;
    private final String email;
    private final String phone;
    private final String notes;
    private final String preferencies;
    private final Boolean passed;
    // Ajoutez tous les autres champs nécessaires à l'UI

    // Méthode utilitaire pour convertir l'Entité en DTO
    public static BirthdayDTO fromEntity(Birthday birthday) {
        return new BirthdayDTO(
                birthday.getId(),
                birthday.getName(),
                birthday.getDate(),
                birthday.getCategory(),
                birthday.getEnableReminders(),
                birthday.getPhoto(),
                birthday.getCity(),
                birthday.getEmail(),
                birthday.getPhone(),
                birthday.getNotes(),
                birthday.getPreferencies(),
                birthday.getPassed()
        );
    }
}