// src/components/Header.tsx
import React from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { user, loading } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo or Site Name */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Hanzi Flashcard App
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <span className="text-gray-600">Hello, {user.username}</span>
                </li>
                <li>
                  <Link
                    to="/logout"
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
