package com.time2wish.time2wish_api.repository;

import com.time2wish.time2wish_api.model.Birthday;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BirthdayRepository extends CrudRepository<Birthday, Long> {
}
