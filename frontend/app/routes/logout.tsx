import React, { useEffect } from "react";
import { useAuth } from "~/context/AuthContext";
const Logout: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <p>You have been logged out.</p>;
};

export default Logout;
