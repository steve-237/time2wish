package com.time2wish.time2wish_api.service;

import com.time2wish.time2wish_api.model.User;
import com.time2wish.time2wish_api.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get a user based on the id (UUID String)
     * @param id - of the user
     * @return An Optional containing the User object
     */
    public Optional<User> getUser(final Long id) {
        return userRepository.findById(id);
    }

    /**
     * Get the list of all users
     * @return an iterable list of all users
     */
    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    /**
     * Delete a user
     * @param id of the user to be deleted (UUID String)
     */
    public void deleteUser(final Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Save a user in the Database (create or update)
     * @param user - user to be saved
     * @return the User object saved
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}