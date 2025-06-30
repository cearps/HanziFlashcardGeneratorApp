package com.hanzifc.backend.controllers;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hanzifc.backend.entities.FlashcardDeckEntity;
import com.hanzifc.backend.entities.FlashcardEntity;
import com.hanzifc.backend.entities.UserEntity;
import com.hanzifc.backend.entities.WordEntity;
import com.hanzifc.backend.repository.FlashcardDeckRepository;
import com.hanzifc.backend.repository.FlashcardRepository;
import com.hanzifc.backend.repository.UserRepository;
import com.hanzifc.backend.repository.WordRepository;

@RestController
@RequestMapping("/flashcard-deck")
public class FlashcardDeckController {

    @Autowired
    private FlashcardDeckRepository flashcardDeckRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private WordRepository wordRepository;

    // DTOs
    public record FlashcardDeckRequest(String name) { }
    public record FlashcardDeckResponse(long id, String name) { }
    public record FlashcardRequest(Long rootWordId, String englishTranslation, String pinyin, String exampleSentences, String pronunciationAudio, String image) { }
    public record FlashcardResponse(Long id, String rootWord, String englishTranslation, String pinyin, String exampleSentences, String pronunciationAudio, String image) { }
    public record DeleteFlashcardsRequest(List<Long> flashcardIds) { }

    @GetMapping
    public List<FlashcardDeckResponse> getFlashcardDecks() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return flashcardDeckRepository.findAllByUserId(user.getId())
                .stream()
                .map(deck -> new FlashcardDeckResponse(deck.getId(), deck.getName()))
                .toList();
    }

    @PostMapping
    public FlashcardDeckResponse newFlashcardDeck(@RequestBody FlashcardDeckRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        FlashcardDeckEntity newDeck = new FlashcardDeckEntity();
        newDeck.setName(request.name());
        newDeck.setUser(user);

        flashcardDeckRepository.save(newDeck);

        return new FlashcardDeckResponse(newDeck.getId(), newDeck.getName());
    }

    @GetMapping("/{deckId}/flashcards")
    public List<FlashcardResponse> getFlashcards(@PathVariable long deckId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        FlashcardDeckEntity deck = flashcardDeckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Flashcard deck not found!"));

        if (!Objects.equals(deck.getUser().getId(), user.getId())) {
            throw new RuntimeException("Flashcard deck does not belong to the user!");
        }

        return flashcardRepository.findAllByFlashcardDeckId(deckId)
                .stream()
                .map(fc -> new FlashcardResponse(
                        fc.getId(),
                        fc.getRootWord().getWord(),
                        fc.getEnglishTranslation(),
                        fc.getPinyin(),
                        fc.getExampleSentences(),
                        fc.getPronunciationAudio(),
                        fc.getImage()
                ))
                .toList();
    }

    @PostMapping("/{deckId}/flashcards")
    public List<FlashcardResponse> newFlashcards(@PathVariable long deckId, @RequestBody List<FlashcardRequest> requests) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        FlashcardDeckEntity deck = flashcardDeckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Flashcard deck not found!"));

        if (!Objects.equals(deck.getUser().getId(), user.getId())) {
            throw new RuntimeException("Flashcard deck does not belong to the user!");
        }

        List<FlashcardResponse> responses = new java.util.ArrayList<>();

        for (FlashcardRequest request : requests) {
            WordEntity rootWord = wordRepository.findById(request.rootWordId())
                    .orElseThrow(() -> new RuntimeException("Root word not found!"));

            if (!Objects.equals(rootWord.getWordList().getUser().getId(), user.getId())) {
                throw new RuntimeException("Root word does not belong to the user!");
            }

            FlashcardEntity newFlashcard = new FlashcardEntity();
            newFlashcard.setRootWord(rootWord);
            newFlashcard.setEnglishTranslation(request.englishTranslation());
            newFlashcard.setPinyin(request.pinyin());
            newFlashcard.setExampleSentences(request.exampleSentences());
            newFlashcard.setPronunciationAudio(request.pronunciationAudio());
            newFlashcard.setImage(request.image());
            newFlashcard.setFlashcardDeck(deck);

            flashcardRepository.save(newFlashcard);

            responses.add(new FlashcardResponse(
                    newFlashcard.getId(),
                    newFlashcard.getRootWord().getWord(),
                    newFlashcard.getEnglishTranslation(),
                    newFlashcard.getPinyin(),
                    newFlashcard.getExampleSentences(),
                    newFlashcard.getPronunciationAudio(),
                    newFlashcard.getImage()
            ));
        }
        return responses;
    }

    @DeleteMapping("/{deckId}/flashcards")
    public void deleteFlashcards(@PathVariable long deckId, @RequestBody DeleteFlashcardsRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        FlashcardDeckEntity deck = flashcardDeckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Flashcard deck not found!"));

        if (!Objects.equals(deck.getUser().getId(), user.getId())) {
            throw new RuntimeException("Flashcard deck does not belong to the user!");
        }

        for (Long flashcardId : request.flashcardIds()) {
            FlashcardEntity flashcard = flashcardRepository.findById(flashcardId)
                    .orElseThrow(() -> new RuntimeException("Flashcard with id " + flashcardId + " not found!"));

            if (!Objects.equals(flashcard.getFlashcardDeck().getId(), deck.getId())) {
                throw new RuntimeException("Flashcard with id " + flashcardId + " does not belong to the specified deck!");
            }
            flashcardRepository.delete(flashcard);
        }
    }
} 