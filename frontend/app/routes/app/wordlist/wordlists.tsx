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
import * as WordListService from "~/services/WordListService";

export default function WordLists() {
  const { token } = useAuth();
  const [wordLists, setWordLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    WordListService.getWordLists(token)
      .then((data) => {
        setWordLists(data.wordLists || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch word lists.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Word Lists</h1>
        <Link to="/app/wordlist/create">
          <Button>Create New Word List</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Word Lists</CardTitle>
          <CardDescription>
            Here are the word lists you have created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : wordLists.length === 0 ? (
            <p className="text-muted-foreground">
              You don't have any word lists yet. Create one to get started!
            </p>
          ) : (
            <ul className="space-y-4">
              {wordLists.map((wl: any) => (
                <li key={wl.id}>
                  <Link
                    to={`/app/wordlist/${wl.id}`}
                    className="block hover:underline"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{wl.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {wl.words.length} words
                      </span>
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
