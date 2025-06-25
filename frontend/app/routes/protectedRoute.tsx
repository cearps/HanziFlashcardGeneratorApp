import { useAuth } from "~/context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user, loading, verifying } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !verifying && !user) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [user, loading, verifying, navigate, location]);

  if (loading || verifying) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}
