package com.hanzifc.backend.repository;


import com.hanzifc.backend.entities.WordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WordRepository extends JpaRepository<WordEntity, Long> {
    List<WordEntity> findAllByWordListId(Long wordListId);
    boolean existsByWordAndWordListId(String word, Long wordListId);

    Optional<WordEntity> findByWordAndWordListId(String word, Long id);
}
