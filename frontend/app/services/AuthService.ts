import { API_BASE_URL } from "~/config/apiConfig";
import type { LoginCredentials, RegistrationData } from "~/types/auth";

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials or server error");
  }

  const data = await response.json();
  return data.token;
};

export const register = async (userData: RegistrationData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to register. Possibly user already exists.");
  }
};
