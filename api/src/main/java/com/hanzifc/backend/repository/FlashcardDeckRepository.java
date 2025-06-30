package com.hanzifc.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hanzifc.backend.entities.FlashcardDeckEntity;

public interface FlashcardDeckRepository extends JpaRepository<FlashcardDeckEntity, Long> {
    List<FlashcardDeckEntity> findAllByUserId(Long userId);
} 