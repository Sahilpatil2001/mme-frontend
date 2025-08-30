import type { FC } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../Firebase";
import type { ProtectedRouteProps } from "../types/ProtectedRouteProps";

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ 1. First check for backend token
      const backendToken = localStorage.getItem("backendToken");
      if (backendToken) {
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      // ✅ 2. If no backend token, check Firebase
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          localStorage.setItem("idToken", token);
          setAuthenticated(true);
        } else {
          localStorage.removeItem("idToken");
          setAuthenticated(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // spinner or loader UI
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
