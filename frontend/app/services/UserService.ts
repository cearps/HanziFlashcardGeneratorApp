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
