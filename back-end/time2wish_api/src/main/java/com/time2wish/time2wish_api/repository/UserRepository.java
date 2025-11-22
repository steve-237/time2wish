package com.time2wish.time2wish_api.repository;

import com.time2wish.time2wish_api.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    // Nouvelle méthode pour charger l'utilisateur ET ses anniversaires
    @Query("SELECT u FROM User u JOIN FETCH u.birthdays b WHERE u.email = :email")
    Optional<User> findByEmailWithBirthdays(@Param("email") String email);

    Optional<User> findByEmail(String email);
}
