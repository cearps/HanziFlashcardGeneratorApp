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
import { Textarea } from "~/components/ui/textarea";
import * as WordListService from "~/services/WordListService";

export default function CreateWordList() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [words, setWords] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("You must be logged in to create a word list.");
      return;
    }
    setLoading(true);
    try {
      // 1. Create the wordlist (name only)
      const created = await WordListService.createWordList(token, name);
      const wordListId = created.id;
      // 2. Parse words (one per line, trim, filter empty)
      const wordArr = words
        .split("\n")
        .map((w) => w.trim())
        .filter((w) => w.length > 0);
      // 3. If there are words, batch add them
      if (wordArr.length > 0) {
        await WordListService.addWordsToWordList(token, wordListId, wordArr);
      }
      // 4. Navigate to wordlists page
      navigate("/app/wordlist/wordlists");
    } catch (err: any) {
      setError(err.message || "Failed to create word list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Word List</CardTitle>
          <CardDescription>
            Give your word list a name and add words to it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Word List Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., HSK 1 Vocabulary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="words">Words</Label>
                <Textarea
                  id="words"
                  placeholder="Enter words, one per line"
                  value={words}
                  onChange={(e) => setWords(e.target.value)}
                  required
                  rows={10}
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Word List"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
