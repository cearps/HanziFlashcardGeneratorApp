import { API_BASE_URL } from "~/config/apiConfig";
import type { FlashcardRequest } from "~/types/flashcard";

function getAuthHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getFlashcardDecks(token: string) {
  const res = await fetch(`${API_BASE_URL}/flashcard-deck`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch flashcard decks");
  return res.json();
}

export async function createFlashcardDeck(token: string, name: string) {
  const res = await fetch(`${API_BASE_URL}/flashcard-deck`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create flashcard deck");
  return res.json();
}

export async function getFlashcards(token: string, deckId: number) {
  const res = await fetch(
    `${API_BASE_URL}/flashcard-deck/${deckId}/flashcards`,
    {
      headers: getAuthHeaders(token),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch flashcards");
  return res.json();
}

export async function addFlashcards(
  token: string,
  deckId: number,
  flashcards: FlashcardRequest[]
) {
  const res = await fetch(
    `${API_BASE_URL}/flashcard-deck/${deckId}/flashcards`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(flashcards),
    }
  );
  if (!res.ok) throw new Error("Failed to add flashcards");
  return res.json();
}

export async function deleteFlashcards(
  token: string,
  deckId: number,
  flashcardIds: number[]
) {
  const res = await fetch(
    `${API_BASE_URL}/flashcard-deck/${deckId}/flashcards`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ flashcardIds }),
    }
  );
  if (!res.ok) throw new Error("Failed to delete flashcards");
  return;
}
