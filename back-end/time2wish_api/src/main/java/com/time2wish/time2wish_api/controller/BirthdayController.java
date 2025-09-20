package com.time2wish.time2wish_api.controller;

import com.time2wish.time2wish_api.model.Birthday;
import com.time2wish.time2wish_api.service.BirthdayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class BirthdayController {

    @Autowired
    private BirthdayService birthdayService;

    /**
     * Get the list of all birthdays
     * @return a list of all birthdays
     */
    @GetMapping("/birthdayTable")
    public Iterable<Birthday> getBirthdays() {
        return birthdayService.getBirthdays();
    }

    /**
     * Create a new birthday
     * @param birthday - birthday object to create
     * @return the new birthday
     */
    @PostMapping("/birthdayTable")
    public Birthday createBirthday(@RequestBody Birthday birthday) {
        return birthdayService.saveBirthday(birthday);
    }

    /**
     * Get a birthday based on the id
     * @param id - id of the birthday to retrieve
     * @return An object birthday
     */
    @GetMapping("/birthday/{id}")
    public Birthday getBirthday(@PathVariable("id") final Long id) {
        Optional<Birthday> birthday = birthdayService.getBirthday(id);
        return birthday.orElse(null);
    }

    /**
     * Update a birthday based on the id
     * @param id - id of the birthday to be updated
     * @return An object birthday
     */
    @PutMapping("/birthday/{id}")
    public Birthday updateBirthday(@PathVariable("id") final Long id, @RequestBody Birthday birthday) {
        Optional<Birthday> birthdayOptional = birthdayService.getBirthday(id);
        if (birthdayOptional.isPresent()) {
            Birthday birthdayToUpdate = birthdayOptional.get();

            String name = birthday.getName();
            if(name != null && !name.isEmpty()) {
                birthdayToUpdate.setName(name);
            }

            String mail = birthday.getEmail();
            if(mail != null && !mail.isEmpty()) {
                birthdayToUpdate.setEmail(mail);
            }

            birthdayService.saveBirthday(birthdayToUpdate);
            return birthdayToUpdate;
        } else {
            return null;
        }
    }

    /**
     * Delete a birthday
     * @param id of the birthday to be deleted
     */
    @DeleteMapping("/birthday/{id}")
    public void deleteBirthday(@PathVariable("id") final Long id) {
        birthdayService.deleteBirthday(id);
    }
}