import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "~/config/apiConfig";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
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

  // 1. On initial load, check localStorage for a token and verify it
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
    }
    // We'll call verifyToken (below) to see if that token is valid
    verifyToken().finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // 2. Method: verify the token by calling /auth/me
  const verifyToken = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch(API_BASE_URL + "/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        // Token invalid or expired => clear user & token
        setUser(null);
        localStorage.removeItem("jwt");
      } else {
        const currentUser = await response.json();
        setUser(currentUser);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("jwt");
    }
  };

  // 3. Method: login (store token, call verify)
  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("jwt", newToken);
    await verifyToken();
  };

  // 4. Method: logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt");
    navigate("/login");
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

// Convenient custom hook:
export const useAuth = () => {
  return useContext(AuthContext);
};
