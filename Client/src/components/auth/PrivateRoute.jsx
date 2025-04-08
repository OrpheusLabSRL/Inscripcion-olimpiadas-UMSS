// src/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles, userRole }) => {
  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
