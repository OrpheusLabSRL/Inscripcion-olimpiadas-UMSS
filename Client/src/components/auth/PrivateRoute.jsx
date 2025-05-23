import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.idRol;

  // Si no hay usuario logueado, redirige al login
  if (!userRole) {
    return <Navigate to="/admin" replace />;
  }

  // Si el rol no está permitido, redirige al login (o a otra página)
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/admin" replace />;
  }

  return element;
};

export default PrivateRoute;
