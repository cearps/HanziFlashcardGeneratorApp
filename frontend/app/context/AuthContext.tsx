import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "~/config/apiConfig";

// Define a user interface as needed
interface User {
  username: string;
  email: string;
  // other fields...
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => void;
  verifyToken: (overrideToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  verifyToken: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  // On initial load, get token from local storage
  // We'll verify in a useEffect below
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // 1. Whenever 'token' changes, verify it
  //    If 'token' is null => setUser(null), else call verify.
  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setUser(null);
    }
    // eslint-disable-next-line
  }, [token]);

  // 2. verifyToken can also be called directly with an override token
  const verifyToken = async (overrideToken?: string) => {
    const localToken = overrideToken ?? token;
    if (!localToken) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localToken}`,
        },
      });
      if (!response.ok) {
        // Token invalid or expired => clear user & token
        setUser(null);
        localStorage.removeItem("jwt");
        setToken(null);
      } else {
        const currentUser = await response.json();
        // console.log("Verified user", currentUser);
        setUser(currentUser);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("jwt");
      setToken(null);
    }
  };

  // 3. login sets token and localStorage
  //    The effect [token] will trigger verifyToken
  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("jwt", newToken);
  };

  // 4. logout clears user, token, localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt");
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy use
export const useAuth = () => useContext(AuthContext);
