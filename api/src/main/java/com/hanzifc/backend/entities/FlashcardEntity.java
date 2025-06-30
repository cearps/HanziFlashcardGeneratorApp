package com.hanzifc.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WordEntity rootWord;

    private String englishTranslation;
    private String pinyin;

    @Lob
    private String exampleSentences; // Storing as a large object, could be JSON or delimited string

    private String pronunciationAudio; // URL or path to audio file
    private String image; // URL or path to image file

    @ManyToOne
    private FlashcardDeckEntity flashcardDeck;
} 