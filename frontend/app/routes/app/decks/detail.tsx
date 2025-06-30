import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import * as FlashcardDeckService from "~/services/FlashcardDeckService";
import * as WordListService from "~/services/WordListService";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import type { FlashcardRequest, FlashcardResponse } from "~/types/flashcard";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface Word {
  id: number;
  word: string;
}

interface WordList {
  id: number;
  name: string;
  words: Word[];
}

export default function FlashcardDeckDetail() {
  const { deckId } = useParams();
  const { token } = useAuth();
  const [flashcards, setFlashcards] = useState<FlashcardResponse[]>([]);
  const [deckName, setDeckName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const deckIdNum = deckId ? parseInt(deckId, 10) : NaN;

  useEffect(() => {
    if (!token || isNaN(deckIdNum)) return;
    if (isNaN(deckIdNum)) {
      setError("Invalid deck ID.");
      setLoading(false);
      return;
    }
    fetchDeckDetails(deckIdNum);
  }, [token, deckId]);

  const fetchDeckDetails = (id: number) => {
    if (!token) return;
    setLoading(true);
    setError("");
    Promise.all([
      FlashcardDeckService.getFlashcardDecks(token),
      FlashcardDeckService.getFlashcards(token, id),
    ])
      .then(([decks, fcs]) => {
        const currentDeck = decks.find((d: any) => d.id === id);
        if (currentDeck) {
          setDeckName(currentDeck.name);
        } else {
          throw new Error("Deck not found.");
        }
        setFlashcards(fcs || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load deck details.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  if (isNaN(deckIdNum)) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <p className="text-red-500">Invalid Deck ID</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/app/decks" className="text-blue-600 hover:underline">
        &larr; Back to Decks
      </Link>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            {loading ? "Loading..." : deckName || "Flashcard Deck"}
          </CardTitle>
          <CardDescription>
            {flashcards && `${flashcards.length} flashcards`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-start mb-4">
            <Button onClick={handleOpenAddModal}>Add from Wordlist</Button>
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : flashcards.length > 0 ? (
            <ul className="space-y-2">
              {flashcards.map((fc) => (
                <li key={fc.id} className="p-2 border rounded">
                  <p>
                    <strong>Word:</strong> {fc.rootWord}
                  </p>
                  <p>
                    <strong>Translation:</strong> {fc.englishTranslation}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No flashcards in this deck yet.</p>
          )}
        </CardContent>
      </Card>
      {showAddModal && (
        <AddFlashcardFromWordListModal
          deckId={deckIdNum}
          existingFlashcards={flashcards}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDeckDetails(deckIdNum);
          }}
        />
      )}
    </div>
  );
}

// Modal Component for adding a single flashcard from a wordlist
function AddFlashcardFromWordListModal({
  deckId,
  existingFlashcards,
  onClose,
  onSuccess,
}: {
  deckId: number;
  existingFlashcards: FlashcardResponse[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { token } = useAuth();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [selectedWordListId, setSelectedWordListId] = useState<string>("");
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [cardData, setCardData] = useState<Partial<FlashcardRequest>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    WordListService.getWordLists(token)
      .then((data) => {
        setWordLists(data.wordLists || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load word lists.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!selectedWordListId) {
      setAvailableWords([]);
      return;
    }
    const selectedList = wordLists.find(
      (wl) => wl.id.toString() === selectedWordListId
    );
    if (selectedList) {
      const existingWordIds = new Set(
        existingFlashcards.map((fc) => fc.rootWordId)
      );
      const newAvailableWords = selectedList.words.filter(
        (w) => !existingWordIds.has(w.id)
      );
      setAvailableWords(newAvailableWords);
    }
  }, [selectedWordListId, wordLists, existingFlashcards]);

  const handleAddClick = (word: Word) => {
    setSelectedWord(word);
    setCardData({
      rootWordId: word.id,
      englishTranslation: "",
      pinyin: "",
      exampleSentences: "",
      pronunciationAudio: "",
      image: "",
    });
  };

  const handleInputChange = (
    field: keyof Omit<FlashcardRequest, "rootWordId">,
    value: string
  ) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !cardData.rootWordId) return;
    setLoading(true);
    setError("");

    try {
      await FlashcardDeckService.addFlashcards(token, deckId, [
        cardData as FlashcardRequest,
      ]);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create flashcard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Flashcard from Wordlist
        </h2>
        <div className="mb-4">
          <Label htmlFor="wordlist-select">Select a Wordlist</Label>
          <select
            id="wordlist-select"
            value={selectedWordListId}
            onChange={(e) => {
              setSelectedWordListId(e.target.value);
              setSelectedWord(null);
              setCardData({});
            }}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">-- Choose a wordlist --</option>
            {wordLists.map((wl) => (
              <option key={wl.id} value={wl.id}>
                {wl.name}
              </option>
            ))}
          </select>
        </div>

        {selectedWordListId && !selectedWord && (
          <div className="flex-grow overflow-y-auto border rounded-md p-2">
            <h3 className="font-semibold mb-2">Available Words</h3>
            {availableWords.length > 0 ? (
              <ul className="space-y-2">
                {availableWords.map((word) => (
                  <li
                    key={word.id}
                    className="flex justify-between items-center p-2 rounded hover:bg-gray-100"
                  >
                    <span>{word.word}</span>
                    <Button size="sm" onClick={() => handleAddClick(word)}>
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No new words to add from this list.
              </p>
            )}
          </div>
        )}

        {selectedWord && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-xl mb-2 text-center">
              {selectedWord.word}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pinyin">Pinyin</Label>
                <Input
                  id="pinyin"
                  value={cardData.pinyin || ""}
                  onChange={(e) => handleInputChange("pinyin", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="translation">English Translation</Label>
                <Input
                  id="translation"
                  value={cardData.englishTranslation || ""}
                  onChange={(e) =>
                    handleInputChange("englishTranslation", e.target.value)
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="examples">Example Sentences</Label>
                <Input
                  id="examples"
                  value={cardData.exampleSentences || ""}
                  onChange={(e) =>
                    handleInputChange("exampleSentences", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedWord(null)}
                disabled={loading}
              >
                Back to list
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Flashcard"}
              </Button>
            </div>
          </form>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="flex justify-end gap-2 mt-auto pt-4">
          {!selectedWord && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
