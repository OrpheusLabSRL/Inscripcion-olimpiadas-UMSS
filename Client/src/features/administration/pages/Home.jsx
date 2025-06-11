import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOlimpiadas } from "../../../api/inscription.api";
import {
  getAreasCategoriasPorOlimpiada,
  getInscripcionesConOlimpiadas,
} from "../../../api/Administration.api";
import {
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaChartBar,
  FaListAlt,
  FaUserFriends,
} from "react-icons/fa";
import "../Styles/Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeOlimpiadas, setActiveOlimpiadas] = useState([]);
  const [areasPorOlimpiada, setAreasPorOlimpiada] = useState({});
  const [allInscripciones, setAllInscripciones] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [participantes, setParticipantes] = useState(0);
  const [pagosPendientes, setPagosPendientes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const permisos = user?.rol?.permisos?.map((p) => p.nombrePermiso) || [];
  const tienePermiso = (permiso) => permisos.includes(permiso);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [response, inscripcionesRes] = await Promise.all([
          getOlimpiadas(),
          getInscripcionesConOlimpiadas(),
        ]);

        const allOlimpiadas = response.data;
        const active = allOlimpiadas.filter((oli) => oli.estadoOlimpiada === 1);
        setActiveOlimpiadas(active);

        const areasPromises = active.map((oli) =>
          getAreasCategoriasPorOlimpiada(oli.idOlimpiada)
        );
        const areasResponses = await Promise.all(areasPromises);

        const areasData = {};
        active.forEach((oli, index) => {
          const res = areasResponses[index];
          const data = Array.isArray(res) ? res : res.data || [];
          areasData[oli.idOlimpiada] = data;
        });
        setAreasPorOlimpiada(areasData);

        const inscripciones = Array.isArray(inscripcionesRes)
          ? inscripcionesRes
          : inscripcionesRes.data || [];
        setAllInscripciones(inscripciones);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setActiveOlimpiadas([]);
        setAreasPorOlimpiada({});
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="adminLoadingContainer">
        <div className="adminSpinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="adminDashboardContainer">
      <div className="adminDashboardHeader">
        <h1>Panel de Control</h1>
        <p>
          {user ? `Bienvenido de nuevo, ${user.nombre}` : "Bienvenido de nuevo"}
        </p>
      </div>

      <div className="adminUserCard">
        <div className="adminUserAvatar">
          <FaUser size={24} />
        </div>
        <div className="adminUserInfo">
          <h2>{user ? user.nombre : "Usuario"}</h2>
          <p>{user?.rol?.nombreRol || "Rol no asignado"}</p>
        </div>
      </div>

      <div className="adminSummarySection">
        <div className="adminSummaryCard">
          <h3>Olimpiadas Activas</h3>
          {activeOlimpiadas.length > 0 ? (
            <div className="adminOlimpiadaSlider">
              {activeOlimpiadas.length > 1 && (
                <button onClick={handlePrev} aria-label="Anterior">
                  <FaArrowLeft />
                </button>
              )}
              <p className="adminBigText">
                {currentOlimpiada?.nombreOlimpiada}
              </p>
              {activeOlimpiadas.length > 1 && (
                <button onClick={handleNext} aria-label="Siguiente">
                  <FaArrowRight />
                </button>
              )}
            </div>
          ) : (
            <p className="adminBigText">No hay olimpiadas activas</p>
          )}
        </div>

        <div className="adminSummaryCard">
          <h3>Áreas Registradas</h3>
          <p className="adminBigText">{currentAreas.length}</p>
          <p>Áreas en {currentOlimpiada?.nombreOlimpiada || "la olimpiada"}</p>
        </div>

        <div className="adminSummaryCard">
          <h3>Participantes</h3>
          <p className="adminBigText">{participantes}</p>
          <p>Estudiantes inscritos</p>
        </div>

        <div className="adminSummaryCard">
          <h3>Pagos Pendientes</h3>
          <p className="adminBigText">{pagosPendientes}</p>
          <p>Pendientes de confirmación</p>
        </div>
      </div>

      <h2 className="adminSectionTitle">Acciones Rápidas</h2>

      <div className="adminActionsSection">
        {tienePermiso("gestionar_datos_base") && (
          <div className="adminActionCard">
            <div className="adminActionIcon">
              <FaListAlt size={32} color="#3498db" />
            </div>
            <h3>Áreas y Categorías</h3>
            <p>Visualiza las áreas y categorías disponibles</p>
            <button onClick={() => navigate("/admin/view-base")}>
              Ir a áreas y categorías
            </button>
          </div>
        )}
        {tienePermiso("crear_usuarios") && (
          <div className="adminActionCard">
            <div className="adminActionIcon">
              <FaUserFriends size={32} color="#3498db" />
            </div>
            <h3>Administrar Usuarios</h3>
            <p>Administrar los roles y usuarios con privilegios</p>
            <button onClick={() => navigate("/admin/manageUser")}>
              Administrar usuarios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
