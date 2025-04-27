import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOlimpiadas } from "../../../api/inscription.api";
import { getAreasCategoriasPorOlimpiada } from "../../../api/Administration.api"; // importamos
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../Styles/Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeOlimpiadas, setActiveOlimpiadas] = useState([]);
  const [areasPorOlimpiada, setAreasPorOlimpiada] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        // 1️⃣ Traer todas las olimpiadas
        const response = await getOlimpiadas();
        const allOlimpiadas = response.data;

        // 2️⃣ Filtrar las activas
        const active = allOlimpiadas.filter((oli) => oli.estadoOlimpiada === 1);
        setActiveOlimpiadas(active);

        // 3️⃣ Para cada olimpiada activa, buscar sus áreas
        const areasData = {};

        for (const oli of active) {
          const res = await getAreasCategoriasPorOlimpiada(oli.idOlimpiada);
          const data = Array.isArray(res) ? res : res.data || [];

          areasData[oli.idOlimpiada] = data; // Guardamos las áreas
        }

        setAreasPorOlimpiada(areasData);
      } catch (error) {
        console.error("❌ Error al cargar olimpiadas o áreas:", error);
        setActiveOlimpiadas([]);
        setAreasPorOlimpiada({});
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activeOlimpiadas.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeOlimpiadas.length - 1 : prevIndex - 1
    );
  };

  const currentOlimpiada = activeOlimpiadas[currentIndex];
  const currentAreas = currentOlimpiada
    ? areasPorOlimpiada[currentOlimpiada.idOlimpiada] || []
    : [];

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
        {/* Nombre de la olimpiada actual */}
        <div
          className="summary-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h3>Nombre de las Olimpiadas Actuales</h3>
          {activeOlimpiadas.length > 0 ? (
            <div
              className="olimpiada-slider"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              {activeOlimpiadas.length > 1 && (
                <button
                  onClick={handlePrev}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <FaArrowLeft />
                </button>
              )}
              <p
                className="big-text"
                style={{
                  margin: "0",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  minWidth: "120px",
                }}
              >
                {currentOlimpiada?.nombreOlimpiada}
              </p>
              {activeOlimpiadas.length > 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <FaArrowRight />
                </button>
              )}
            </div>
          ) : (
            <p className="big-text">No hay olimpiadas activas</p>
          )}
        </div>

        {/* Cantidad de áreas */}
        <div
          className="summary-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h3>Áreas Registradas</h3>
          <p className="big-text">{currentAreas.length}</p>
          <p>Aún se pueden aumentar</p>
        </div>

        {/* Participantes */}
        <div className="summary-card">
          <h3>Participantes</h3>
          <p className="big-text">500</p>
          <p>+20% respecto al mes anterior</p>
        </div>

        {/* Pagos pendientes */}
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
