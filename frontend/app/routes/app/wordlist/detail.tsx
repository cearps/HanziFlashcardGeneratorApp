import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import * as WordListService from "~/services/WordListService";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function WordListDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [wordList, setWordList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [bulkAddText, setBulkAddText] = useState("");
  const [bulkAdding, setBulkAdding] = useState(false);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Fetch all wordlists and find the one with this id
  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    setError("");
    WordListService.getWordLists(token)
      .then((data) => {
        const wl = (data.wordLists || []).find(
          (w: any) => String(w.id) === String(id)
        );
        if (!wl) throw new Error("Word list not found");
        setWordList(wl);
      })
      .catch((err) => setError(err.message || "Failed to load word list."))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !wordList || !newWord.trim()) return;
    setAdding(true);
    setError("");
    try {
      await WordListService.addWordsToWordList(token, wordList.id, [
        newWord.trim(),
      ]);
      setWordList({ ...wordList, words: [...wordList.words, newWord.trim()] });
      setNewWord("");
    } catch (err: any) {
      setError(err.message || "Failed to add word.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveWord = async (word: string) => {
    if (!token || !wordList) return;
    setRemoving(word);
    setError("");
    try {
      await WordListService.removeWordsFromWordList(token, wordList.id, [word]);
      setWordList({
        ...wordList,
        words: wordList.words.filter((w: string) => w !== word),
      });
    } catch (err: any) {
      setError(err.message || "Failed to remove word.");
    } finally {
      setRemoving(null);
    }
  };

  const handleDeleteList = async () => {
    if (!token || !wordList) return;
    setDeleting(true);
    setError("");
    try {
      await WordListService.deleteWordList(token, wordList.id);
      navigate("/app/wordlist/wordlists");
    } catch (err: any) {
      setError(err.message || "Failed to delete word list.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Bulk Add Handler
  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !wordList) return;
    const words = bulkAddText
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w.length > 0 && !wordList.words.includes(w));
    if (words.length === 0) return;
    setBulkAdding(true);
    setError("");
    try {
      await WordListService.addWordsToWordList(token, wordList.id, words);
      setWordList({ ...wordList, words: [...wordList.words, ...words] });
      setBulkAddText("");
      setShowBulkAddModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to bulk add words.");
    } finally {
      setBulkAdding(false);
    }
  };

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (!token || !wordList || selectedWords.length === 0) return;
    setBulkDeleting(true);
    setError("");
    try {
      await WordListService.removeWordsFromWordList(
        token,
        wordList.id,
        selectedWords
      );
      setWordList({
        ...wordList,
        words: wordList.words.filter((w: string) => !selectedWords.includes(w)),
      });
      setSelectedWords([]);
      setBulkDeleteMode(false);
    } catch (err: any) {
      setError(err.message || "Failed to bulk delete words.");
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link
        to="/app/wordlist/wordlists"
        className="text-blue-600 hover:underline"
      >
        &larr; Back to Word Lists
      </Link>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            {loading ? "Loading..." : wordList?.name || "Word List"}
          </CardTitle>
          <CardDescription>
            {wordList && `${wordList.words.length} words`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : wordList ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowBulkAddModal(true)}
                >
                  Bulk Add Words
                </Button>
                <Button
                  variant={bulkDeleteMode ? "destructive" : "secondary"}
                  onClick={() => {
                    setBulkDeleteMode((v) => !v);
                    setSelectedWords([]);
                  }}
                >
                  {bulkDeleteMode ? "Cancel Bulk Delete" : "Bulk Delete Words"}
                </Button>
              </div>
              <form onSubmit={handleAddWord} className="flex gap-2 mb-4">
                <Input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Add a new word"
                  disabled={adding}
                />
                <Button type="submit" disabled={adding || !newWord.trim()}>
                  {adding ? "Adding..." : "Add"}
                </Button>
              </form>
              {bulkDeleteMode && (
                <div className="mb-4">
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleting || selectedWords.length === 0}
                  >
                    {bulkDeleting
                      ? "Deleting..."
                      : `Delete Selected (${selectedWords.length})`}
                  </Button>
                </div>
              )}
              <ul className="space-y-2 mb-4">
                {wordList.words.map((word: string, idx: number) => (
                  <li
                    key={word}
                    className="flex justify-between items-center gap-2 border-b last:border-b-0 py-2"
                  >
                    <div className="flex items-center gap-2 flex-grow">
                      {bulkDeleteMode && (
                        <input
                          type="checkbox"
                          checked={selectedWords.includes(word)}
                          onChange={(e) => {
                            setSelectedWords((prev) =>
                              e.target.checked
                                ? [...prev, word]
                                : prev.filter((w) => w !== word)
                            );
                          }}
                        />
                      )}
                      <span className="truncate">{word}</span>
                    </div>
                    {!bulkDeleteMode && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveWord(word)}
                        disabled={removing === word}
                      >
                        {removing === word ? "Removing..." : "Remove"}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                Delete Word List
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
      {/* Bulk Add Modal */}
      {showBulkAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">
              Bulk Add Words
            </h2>
            <form
              onSubmit={handleBulkAdd}
              className="w-full flex flex-col items-center"
            >
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={8}
                placeholder="Enter one word per line"
                value={bulkAddText}
                onChange={(e) => setBulkAddText(e.target.value)}
                disabled={bulkAdding}
              />
              <div className="flex gap-4 w-full justify-center">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowBulkAddModal(false)}
                  disabled={bulkAdding}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={bulkAdding || !bulkAddText.trim()}
                >
                  {bulkAdding ? "Adding..." : "Add Words"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">
              Delete Word List?
            </h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete this word list? This action cannot
              be undone.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteList}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
