import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import * as FlashcardDeckService from "~/services/FlashcardDeckService";

export default function CreateFlashcardDeck() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("You must be logged in to create a deck.");
      return;
    }
    setLoading(true);
    try {
      await FlashcardDeckService.createFlashcardDeck(token, name);
      navigate("/app/decks");
    } catch (err: any) {
      setError(err.message || "Failed to create flashcard deck.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Flashcard Deck</CardTitle>
          <CardDescription>Give your new deck a name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Deck Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., HSK 1 Practice"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Deck"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
