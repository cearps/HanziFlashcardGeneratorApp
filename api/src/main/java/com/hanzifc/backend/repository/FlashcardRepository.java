package com.hanzifc.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hanzifc.backend.entities.FlashcardEntity;

public interface FlashcardRepository extends JpaRepository<FlashcardEntity, Long> {
    List<FlashcardEntity> findAllByFlashcardDeckId(Long flashcardDeckId);

    boolean existsByRootWordIdAndFlashcardDeckId(Long rootWordId, Long flashcardDeckId);
} 