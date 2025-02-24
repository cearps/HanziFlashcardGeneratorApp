import React, { useEffect } from "react";
import { useAuth } from "~/context/AuthContext";

const Logout: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold">Logged out</h1>
      <p className="mt-4 text-lg">You have been successfully logged out.</p>
    </div>
  );
};

export default Logout;
