import { useState } from "react";
import { useNavigate } from "react-router";
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

export default function CreateWordList() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [words, setWords] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO: Implement word list creation logic
    console.log({ name, words });

    // For now, just navigate back to the word lists page
    navigate("/app/wordlist/wordlists");
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
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit">Create Word List</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
