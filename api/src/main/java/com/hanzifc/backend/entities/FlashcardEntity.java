package com.hanzifc.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"rootWord_id", "flashcardDeck_id"})
})
public class FlashcardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WordEntity rootWord;

    private String englishTranslation;
    private String pinyin;

    @Column(columnDefinition = "TEXT")
    private String exampleSentences; // Storing as a large object, could be JSON or delimited string

    private String pronunciationAudio; // URL or path to audio file
    private String image; // URL or path to image file

    @ManyToOne
    private FlashcardDeckEntity flashcardDeck;
} 