import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 🔥 Activamos el uso de navigate

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log(storedUser);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        {user ? (
          <p>Bienvenido de nuevo, {user.nombre}</p>
        ) : (
          <p>Bienvenido de nuevo</p>
        )}
      </div>

      <div className="user-card">
        <div className="user-avatar">
          <span role="img" aria-label="user">
            👤
          </span>
        </div>
        <div className="user-info">
          {user ? (
            <>
              <h2>{user.nombre}</h2>
              <p>{user.rol ? user.rol.nombreRol : "Rol no asignado"}</p>
            </>
          ) : (
            <>
              <h2>Usuario</h2>
              <p>Rol</p>
            </>
          )}
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Nombre de la Olimpiada Actual</h3>
          <p className="big-text">O!SansInvierno</p>
          <p>Finaliza en 3 meses</p>
        </div>
        <div className="summary-card">
          <h3>Áreas Registradas</h3>
          <p className="big-text">6</p>
          <p>Aún se pueden aumentar</p>
        </div>
        <div className="summary-card">
          <h3>Participantes</h3>
          <p className="big-text">500</p>
          <p>+20% respecto al mes anterior</p>
        </div>
        <div className="summary-card">
          <h3>Pagos Pendientes</h3>
          <p className="big-text">3</p>
          <p>Aún le quedan 3 meses para pagar</p>
        </div>
      </div>

      <h2 className="section-title">Acciones Rápidas</h2>

      <div className="actions-section">
        <div className="action-card">
          <h3>Áreas y Categorías</h3>
          <p>Visualiza las áreas y categorías disponibles</p>
          <button onClick={() => navigate("/admin/base-data")}>
            IR A ÁREAS Y CATEGORÍAS
          </button>
        </div>

        <div className="action-card">
          <h3>Generar Reportes</h3>
          <p>Genera reportes personalizados con filtros</p>
          <button onClick={() => navigate("/admin/reports")}>
            GENERAR REPORTES
          </button>
        </div>
      </div>
    </div>
  );
}
