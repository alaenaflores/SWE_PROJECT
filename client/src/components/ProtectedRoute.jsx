import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user || !user.id) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // user exists, show the page
};

export default ProtectedRoute;