import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "~/config/apiConfig";
import { useAuth } from "~/context/AuthContext";
import * as AuthService from "~/services/AuthService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const token = await AuthService.login({ usernameOrEmail, password });
      await login(token);
      navigate("/app");
    } catch (error: any) {
      logout();
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username or Email
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
