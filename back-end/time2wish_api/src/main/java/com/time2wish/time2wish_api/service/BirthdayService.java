package com.time2wish.time2wish_api.service;

import com.time2wish.time2wish_api.model.Birthday;
import com.time2wish.time2wish_api.repository.BirthdayRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;

import java.util.Optional;


@SpringBootApplication
@Data
@Service
public class BirthdayService {

    @Autowired
    private BirthdayRepository birthdayRepository;

    /**
     * Get a birthday based on the id
     * @param id - of the birthday
     * @return An object birthday
     */
    public Optional<Birthday> getBirthday(final Long id) {
        return birthdayRepository.findById(id);
    }

    /**
     * Get the list of all birthdays
     * @return a list of all birthdays
     */
    public Iterable<Birthday> getBirthdays() {
        return birthdayRepository.findAll();
    }

    /**
     * Delete an employee
     * @param id of the employee to be deleted
     */
    public void deleteBirthday(final Long id) {
        birthdayRepository.deleteById(id);
    }

    /**
     * Save a birthday in the Database
     * @param birthday - birthday saved
     * @return the Object birthday saved
     */
    public Birthday saveBirthday(Birthday birthday) {
        return birthdayRepository.save(birthday);
    }

}