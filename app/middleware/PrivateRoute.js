"use client";
import { useRouter } from "next/navigation"; // Corrected import for App Router
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  

  return user ? children : null;
};

export default PrivateRoute;
