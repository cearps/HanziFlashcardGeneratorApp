export interface FlashcardRequest {
  rootWordId: number;
  englishTranslation: string;
  pinyin: string;
  exampleSentences: string;
  pronunciationAudio: string;
  image: string;
}

export interface FlashcardResponse extends FlashcardRequest {
  id: number;
  rootWord: string;
}
