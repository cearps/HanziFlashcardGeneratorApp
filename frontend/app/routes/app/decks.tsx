import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import * as FlashcardDeckService from "~/services/FlashcardDeckService";

interface Deck {
  id: number;
  name: string;
}

export default function FlashcardDecks() {
  const { token } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    FlashcardDeckService.getFlashcardDecks(token)
      .then((data) => {
        setDecks(data || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch flashcard decks.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Flashcard Decks</h1>
        <Link to="/app/decks/create">
          <Button>Create New Deck</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Flashcard Decks</CardTitle>
          <CardDescription>
            Here are the flashcard decks you have created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : decks.length === 0 ? (
            <p className="text-muted-foreground">
              You don't have any flashcard decks yet. Create one to get started!
            </p>
          ) : (
            <ul className="space-y-4">
              {decks.map((deck) => (
                <li key={deck.id}>
                  <Link
                    to={`/app/decks/${deck.id}`}
                    className="block hover:underline"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{deck.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
