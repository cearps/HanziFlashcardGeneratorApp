package com.hanzifc.backend.repository;

import com.hanzifc.backend.entities.WordListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordListRepository extends JpaRepository<WordListEntity, Long> {

    List<WordListEntity> findAllByUserId(Long userId);

    // check if a word list with the given name exists for the given user
    boolean existsByNameAndUserId(String name, Long userId);
}
