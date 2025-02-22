package com.hanzifc.backend.controllers;

import com.hanzifc.backend.entities.UserEntity;
import com.hanzifc.backend.entities.WordEntity;
import com.hanzifc.backend.entities.WordListEntity;
import com.hanzifc.backend.repository.UserRepository;
import com.hanzifc.backend.repository.WordListRepository;
import com.hanzifc.backend.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/wordlist")
public class WordListController {

    @Autowired
    private WordListRepository wordListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WordRepository wordRepository;

    // DTOs
    public record WordListWordsRequest(List<String> words) { }
    public record WordListRequest(String name) { }
    public record SingleWordListResponse(long id, String name, List<String> words) { }
    public record WordListResponse(SingleWordListResponse[] wordLists) { }

    @GetMapping
    public WordListResponse getWordLists() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return new WordListResponse(wordListRepository.findAllByUserId(user.getId())
                .stream()
                .map(wordList -> new SingleWordListResponse(
                        wordList.getId(),
                        wordList.getName(),
                        wordRepository.findAllByWordListId(wordList.getId()).stream().map(WordEntity::getWord).toList()))
                .toArray(SingleWordListResponse[]::new));
    }

    @PostMapping
    public SingleWordListResponse newWordList(@RequestBody WordListRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (wordListRepository.existsByNameAndUserId(request.name(), user.getId())) {
            throw new RuntimeException("Word list with the given name already exists!");
        }

        // create new word list
        WordListEntity newWordList = new WordListEntity();
        newWordList.setName(request.name());
        newWordList.setUser(user);

        wordListRepository.save(newWordList);

        return new SingleWordListResponse(newWordList.getId(), newWordList.getName(), List.of());
    }

    @DeleteMapping("/{id}")
    public void deleteWordList(@PathVariable long id) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        WordListEntity wordList = wordListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Word list not found!"));

        if (!Objects.equals(wordList.getUser().getId(), user.getId())) {
            throw new RuntimeException("Word list does not belong to the user!");
        }

        wordRepository.deleteAll(wordRepository.findAllByWordListId(id));

        wordListRepository.deleteById(id);
    }

    @PostMapping("/{id}/words")
    public WordListResponse addWords(@RequestBody WordListWordsRequest request, @PathVariable long id) {
        // add word to word list
        WordListEntity wordList = getWordListByIdAndUser(id);

        // add words to the word list
        for (String word : request.words()) {
            if (wordRepository.existsByWordAndWordListId(word, wordList.getId())) {
                throw new RuntimeException("Word already exists in the word list!");
            }
            WordEntity newWord = new WordEntity();
            newWord.setWord(word);
            newWord.setWordList(wordList);
            wordRepository.save(newWord);
        }

        return getWordLists();
    }

    @DeleteMapping("/{id}/words")
    public WordListResponse deleteWords(@RequestBody WordListWordsRequest request, @PathVariable long id) {
        // delete word from word list
        WordListEntity wordList = getWordListByIdAndUser(id);

        // delete words from the word list
        for (String word : request.words()) {
            WordEntity wordEntity = wordRepository.findByWordAndWordListId(word, wordList.getId())
                    .orElseThrow(() -> new RuntimeException("Word not found in the word list!"));
            wordRepository.delete(wordEntity);
        }

        return getWordLists();
    }

    private WordListEntity getWordListByIdAndUser(long wordListId) {
        WordListEntity wordList = wordListRepository.findById(wordListId)
                .orElseThrow(() -> new RuntimeException("Word list not found!"));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!Objects.equals(wordList.getUser().getId(), user.getId())) {
            throw new RuntimeException("Word list does not belong to the user!");
        }

        return wordList;
    }

}
