import { API_BASE_URL } from "~/config/apiConfig";
import type { User } from "~/types/user";

export const fetchUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid or expired token");
  }

  return response.json();
};

export const updateUsername = async (token: string, newUsername: string) => {
  const response = await fetch(`${API_BASE_URL}/me/username`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newUsername }),
  });
  return response.json();
};

export const updateEmail = async (token: string, newEmail: string) => {
  const response = await fetch(`${API_BASE_URL}/me/email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newEmail }),
  });
  return response.json();
};

export const updatePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
) => {
  const response = await fetch(`${API_BASE_URL}/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response.json();
};
