import { API_BASE_URL } from "~/config/apiConfig";

function getAuthHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getWordLists(token: string) {
  const res = await fetch(`${API_BASE_URL}/wordlist`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch word lists");
  return res.json();
}

export async function createWordList(token: string, name: string) {
  const res = await fetch(`${API_BASE_URL}/wordlist`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create word list");
  return res.json();
}

export async function addWordsToWordList(
  token: string,
  wordListId: number,
  words: string[]
) {
  const res = await fetch(`${API_BASE_URL}/wordlist/${wordListId}/words`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ words }),
  });
  if (!res.ok) throw new Error("Failed to add words to word list");
  return res.json();
}

export async function removeWordsFromWordList(
  token: string,
  wordListId: number,
  words: string[]
) {
  const res = await fetch(`${API_BASE_URL}/wordlist/${wordListId}/words`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ words }),
  });
  if (!res.ok) throw new Error("Failed to remove words from word list");
  return res.json();
}

export async function deleteWordList(token: string, wordListId: number) {
  const res = await fetch(`${API_BASE_URL}/wordlist/${wordListId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete word list");
  return res;
}
