import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getOlimpiadas,
  getAreasCategoriasPorOlimpiada,
} from "../../api/Administration.api";
import "../detallesOlimpiada/OlympiadDetail.css";
import HeaderProp from "../home_usuario/components/HeaderProp";
import Footer from "../home_usuario/components/Footer";
import { TutorForm } from "../registrarion/pages/TutorForm";

const OlympiadDetail = () => {
  const { id } = useParams();
  const [olympiad, setOlympiad] = useState(null);
  const [areasCategorias, setAreasCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAreaId, setExpandedAreaId] = useState(null); // Para mostrar u ocultar detalles

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
        sessionStorage.setItem("idOlimpiada", id);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleExpand = (idArea) => {
    setExpandedAreaId((prev) => (prev === idArea ? null : idArea));
  };

  if (loading) return <div>Cargando información de la olimpiada...</div>;
  if (!olympiad) return <div>No se encontró la olimpiada</div>;

  return (
    <div className="olympiad-detail-page">
      <HeaderProp />
      <div className="olympiad-detail-content">
        <div className="olympiad-hero">
          <div className="olympiad-hero-overlay">
            <h2>{olympiad.nombreOlimpiada}</h2>
            <p>
              <strong>Versión:</strong> {olympiad.version}
            </p>
            <p>
              <strong>Inicio:</strong> {olympiad.fechaInicioOlimpiada}{" "}
              <strong>Fin:</strong> {olympiad.fechaFinOlimpiada}
            </p>
          </div>
        </div>

        <h2>Áreas</h2>
        {areasCategorias.length === 0 ? (
          <p>No hay áreas o categorías asociadas a esta olimpiada.</p>
        ) : (
          <div className="tarjetas-container">
            {areasCategorias.map((area) => (
              <div className="area-card-horizontal" key={area.idArea}>
                <div className="area-card-image">
                  <img
                    src="https://img.freepik.com/vector-gratis/concepto-astronomia-iconos-dibujos-animados-ciencia-retro_1284-7503.jpg?semt=ais_hybrid&w=740"
                    alt="Área"
                  />
                </div>
                <div className="area-card-content">
                  <h4>{area.nombreArea}</h4>
                  <p>{area.descripcionArea}</p>
                  <button
                    className="toggle-button"
                    onClick={() => toggleExpand(area.idArea)}
                  >
                    {" "}
                    <i className="bi bi-eye"></i>
                    {expandedAreaId === area.idArea
                      ? "Ocultar"
                      : "Ver más información"}
                  </button>

                  {expandedAreaId === area.idArea && (
                    <div className="categorias-desplegable">
                      <h4>Categorías:</h4>
                      <ul>
                        {area.categorias.map((categoria) => (
                          <li key={categoria.idCategoria}>
                            <strong>{categoria.nombreCategoria}</strong>
                            <ul>
                              {categoria.grados.map((grado) => (
                                <li key={grado.idGrado}>
                                  Grado {grado.numeroGrado} - Nivel:{" "}
                                  {grado.nivel}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="inscripcion">
          <h2>Proceso de Inscripción</h2>
          <TutorForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OlympiadDetail;
