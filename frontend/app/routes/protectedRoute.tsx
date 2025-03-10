import { useAuth } from "~/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    console.log("ProtectedRoute: user is not logged in");
    // Not logged in => redirect to /login
    // 'state' can store the current location so you can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise, user is logged in => render the child route content
  return <Outlet />;
}
