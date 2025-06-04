import { Navigate } from "react-router-dom";

const PrivateRoute = ({
  element,
  allowedRoles,
  allowedPermiso,
  withoutAllowed = false,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.idRol;

  if (withoutAllowed) {
    return element;
  }

  if (!userRole) {
    return <Navigate to="/admin" replace />;
  }

  // // Si el rol no está permitido, redirige al login (o a otra página)
  // if (!allowedRoles.includes(userRole)) {
  //   return <Navigate to="/admin" replace />;
  // }

  const tienePermiso = (permisoRequerido) => {
    return user?.rol?.permisos?.some(
      (p) => p.nombrePermiso === permisoRequerido
    );
  };

  if (!tienePermiso(allowedPermiso)) return <Navigate to="/no-autorizado" />;

  return element;
};

export default PrivateRoute;
