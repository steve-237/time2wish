package com.time2wish.time2wish_api.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "birthdays")

public class Birthday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    private String email;

    private String password;

    private String city;

    private String category;

    private String photo;

    private String phone;

    private String notes;

    private String preferencies;

    @Column(name = "birthday_date")
    private LocalDate date;

    private Boolean enableReminders;

    private Boolean passed;

}
