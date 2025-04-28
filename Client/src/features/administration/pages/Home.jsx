import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOlimpiadas } from "../../../api/inscription.api";
import {
  getAreasCategoriasPorOlimpiada,
  getInscripcionesConOlimpiadas,
} from "../../../api/Administration.api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../Styles/Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeOlimpiadas, setActiveOlimpiadas] = useState([]);
  const [areasPorOlimpiada, setAreasPorOlimpiada] = useState({});
  const [allInscripciones, setAllInscripciones] = useState([]); // 🔥 todas las inscripciones
  const [currentIndex, setCurrentIndex] = useState(0);

  const [participantes, setParticipantes] = useState(0);
  const [pagosPendientes, setPagosPendientes] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const response = await getOlimpiadas();
        const allOlimpiadas = response.data;
        const active = allOlimpiadas.filter((oli) => oli.estadoOlimpiada === 1);
        setActiveOlimpiadas(active);

        const areasData = {};
        for (const oli of active) {
          const res = await getAreasCategoriasPorOlimpiada(oli.idOlimpiada);
          const data = Array.isArray(res) ? res : res.data || [];
          areasData[oli.idOlimpiada] = data;
        }
        setAreasPorOlimpiada(areasData);

        const inscripcionesRes = await getInscripcionesConOlimpiadas();
        const inscripciones = Array.isArray(inscripcionesRes)
          ? inscripcionesRes
          : inscripcionesRes.data || [];
        setAllInscripciones(inscripciones);
      } catch (error) {
        console.error("Error al cargar olimpiadas o áreas:", error);
        setActiveOlimpiadas([]);
        setAreasPorOlimpiada({});
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeOlimpiadas.length > 0 && allInscripciones.length > 0) {
      const currentOlimpiada = activeOlimpiadas[currentIndex];
      const filtered = allInscripciones.filter(
        (insc) => insc.idOlimpiada === currentOlimpiada.idOlimpiada
      );

      const participantesActivos = filtered.filter(
        (insc) => insc.estadoInscripcion === 1
      ).length;
      const pagosPendientesActivos = filtered.filter(
        (insc) => insc.estadoInscripcion === 0
      ).length;

      setParticipantes(participantesActivos);
      setPagosPendientes(pagosPendientesActivos);
    } else {
      setParticipantes(0);
      setPagosPendientes(0);
    }
  }, [currentIndex, activeOlimpiadas, allInscripciones]);

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
        {/* Olimpiadas actuales */}
        <div className="summary-card" style={{ textAlign: "center" }}>
          <h3>Nombre de las Olimpiadas Actuales</h3>
          {activeOlimpiadas.length > 0 ? (
            <div
              className="olimpiada-slider"
              style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
            >
              {activeOlimpiadas.length > 1 && (
                <button
                  onClick={handlePrev}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FaArrowLeft />
                </button>
              )}
              <p
                className="big-text"
                style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold" }}
              >
                {currentOlimpiada?.nombreOlimpiada}
              </p>
              {activeOlimpiadas.length > 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    background: "none",
                    border: "none",
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

        {/* Áreas Registradas */}
        <div className="summary-card" style={{ textAlign: "center" }}>
          <h3>Áreas Registradas</h3>
          <p className="big-text">{currentAreas.length}</p>
          <p>Aún se pueden aumentar</p>
        </div>

        {/* Participantes */}
        <div className="summary-card">
          <h3>Participantes</h3>
          <p className="big-text">{participantes}</p>
          <p>+20% respecto al mes anterior</p>
        </div>

        {/* Pagos Pendientes */}
        <div className="summary-card">
          <h3>Pagos Pendientes</h3>
          <p className="big-text">{pagosPendientes}</p>
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
