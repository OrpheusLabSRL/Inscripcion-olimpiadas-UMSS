import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getOlimpiadas,
  getAreasCategoriasPorOlimpiada,
} from "../../../api/Administration.api";
import "../styles/olympicDetail.css";
import HeaderProp from "../../homeUser/components/HeaderProp";
import Footer from "../../homeUser/components/Footer";
import { GenericModal } from "../../../components/modals/GenericModal";

// Importar iconos de React Icons
import {
  FaFlask,
  FaCalculator,
  FaGlobe,
  FaAtom,
  FaMicroscope,
  FaLeaf,
  FaLaptopCode,
  FaBook,
  FaPalette,
  FaMusic,
  FaRunning,
  FaLanguage,
  FaBuilding,
  FaStar,
  FaPencilAlt,
} from "react-icons/fa";

const OlympicDetail = () => {
  const { id } = useParams();
  const [olympiad, setOlympiad] = useState(null);
  const [areasCategorias, setAreasCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);

  // Función para obtener el icono según el nombre del área
  const getAreaIcon = (nombreArea) => {
    const area = nombreArea.toLowerCase();

    if (area.includes("matemática") || area.includes("matemáticas"))
      return <FaCalculator />;
    if (area.includes("física")) return <FaAtom />;
    if (area.includes("química")) return <FaFlask />;
    if (area.includes("biología") || area.includes("ciencias naturales"))
      return <FaMicroscope />;
    if (area.includes("geografía") || area.includes("ciencias sociales"))
      return <FaGlobe />;
    if (
      area.includes("informática") ||
      area.includes("computación") ||
      area.includes("programación")
    )
      return <FaLaptopCode />;
    if (area.includes("literatura") || area.includes("lengua"))
      return <FaBook />;
    if (
      area.includes("arte") ||
      area.includes("dibujo") ||
      area.includes("pintura")
    )
      return <FaPalette />;
    if (area.includes("música")) return <FaMusic />;
    if (area.includes("educación física") || area.includes("deportes"))
      return <FaRunning />;
    if (
      area.includes("idiomas") ||
      area.includes("inglés") ||
      area.includes("francés")
    )
      return <FaLanguage />;
    if (area.includes("arquitectura") || area.includes("ingeniería"))
      return <FaBuilding />;
    if (area.includes("ecología") || area.includes("medio ambiente"))
      return <FaLeaf />;

    // Icono por defecto
    return <FaStar />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allOlympiads = await getOlimpiadas();
        const found = allOlympiads.data.find(
          (o) => o.idOlimpiada.toString() === id
        );
        setOlympiad(found);

        const responseAreasCat = await getAreasCategoriasPorOlimpiada(id);
        const areasCategoriasData = responseAreasCat.data || responseAreasCat;
        setAreasCategorias(areasCategoriasData);
        sessionStorage.setItem("OlympicData", JSON.stringify(found));
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openModal = (area) => {
    setAreaSeleccionada(area);
    setModalIsOpen(true);
  };

  const navigate = useNavigate();

  const handleInscriptionClick = () => {
    navigate("/register");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setAreaSeleccionada(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#547792",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #547792",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          Cargando información de la olimpiada...
        </div>
      </div>
    );
  }

  if (!olympiad) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#e74c3c",
        }}
      >
        No se encontró la olimpiada
      </div>
    );
  }

  return (
    <div className="olympiad-detail-page">
      <HeaderProp />
      <div className="olympiad-detail-content">
        <div className="olympiad-hero">
          <div className="olympiad-hero-overlay">
            <h1>{olympiad.nombreOlimpiada}</h1>
            <p>
              <strong>Versión:</strong> {olympiad.version}
            </p>
            <p>
              <strong>Desde</strong>{" "}
              {new Date(olympiad.fechaInicioOlimpiada).toLocaleDateString(
                "es-ES",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}{" "}
              <strong>hasta</strong>{" "}
              {new Date(olympiad.fechaFinOlimpiada).toLocaleDateString(
                "es-ES",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>
          <div className="inscriptionButtonContainer">
            <button
              className="inscriptionButton"
              onClick={handleInscriptionClick}
            >
              <FaPencilAlt />
              Inscribirse a esta olimpiada
            </button>
          </div>
        </div>

        <h2>Áreas de Conocimiento</h2>
        {areasCategorias.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666",
              fontSize: "1.1rem",
            }}
          >
            <FaStar
              style={{ fontSize: "3rem", marginBottom: "1rem", color: "#ccc" }}
            />
            <p>No hay áreas o categorías asociadas a esta olimpiada.</p>
          </div>
        ) : (
          <div className="tarjetas-container">
            {areasCategorias.map((area) => (
              <div className="area-card-horizontal" key={area.idArea}>
                <div className="area-card-icon">
                  {getAreaIcon(area.nombreArea)}
                </div>
                <div className="area-card-content">
                  <h4>{area.nombreArea}</h4>
                  <p>{area.descripcionArea}</p>
                  <button
                    className="toggle-button"
                    onClick={() => openModal(area)}
                  >
                    <i className="bi bi-eye"></i>
                    Ver más información
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GenericModal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        {areaSeleccionada && (
          <div className="container-content-modal">
            <h3>{areaSeleccionada.nombreArea}</h3>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                color: "#666",
                marginBottom: "25px",
              }}
            >
              {areaSeleccionada.descripcionArea}
            </p>
            <h4>Categorías disponibles:</h4>
            <ul>
              {areaSeleccionada.categorias.map((categoria) => (
                <li key={categoria.idCategoria}>
                  <strong>{categoria.nombreCategoria}</strong>
                  <ul>
                    {categoria.grados.map((grado) => (
                      <li key={grado.idGrado}>
                        Grado {grado.numeroGrado} - Nivel: {grado.nivel}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </GenericModal>

      <Footer />

      {/* Agregar animación de spin para el loading */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default OlympicDetail;
