import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import * as FlashcardDeckService from "~/services/FlashcardDeckService";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import type { FlashcardResponse } from "~/types/flashcard";

export default function FlashcardDeckDetail() {
  const { deckId } = useParams();
  const { token } = useAuth();
  const [flashcards, setFlashcards] = useState<FlashcardResponse[]>([]);
  const [deckName, setDeckName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !deckId) return;
    const deckIdNum = parseInt(deckId, 10);
    if (isNaN(deckIdNum)) {
      setError("Invalid deck ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    // Fetch deck details and flashcards
    Promise.all([
      FlashcardDeckService.getFlashcardDecks(token),
      FlashcardDeckService.getFlashcards(token, deckIdNum),
    ])
      .then(([decks, fcs]) => {
        const currentDeck = decks.find((d: any) => d.id === deckIdNum);
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
  }, [token, deckId]);

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
    </div>
  );
}
