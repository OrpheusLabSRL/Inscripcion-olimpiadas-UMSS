import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getOlimpiadas,
  getAreasCategoriasPorOlimpiada,
} from "../../api/Administration.api";
import "../detallesOlimpiada/OlimpiadaDetallada.css";
import HeaderProp from "../home_usuario/components/HeaderProp";
import Footer from "../home_usuario/components/Footer";
import { TutorForm } from "../registrarion/pages/TutorForm";
import { GenericModal } from "../../components/modals/GenericModal"; // Ajusta el path si es diferente

const OlimpiadaDetallada = () => {
  const { id } = useParams();
  const [olympiad, setOlympiad] = useState(null);
  const [areasCategorias, setAreasCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);

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

  const closeModal = () => {
    setModalIsOpen(false);
    setAreaSeleccionada(null);
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
            <p><strong>Versión:</strong> {olympiad.version}</p>
            <p>
              <strong>Desde</strong>{" "}
              {new Date(olympiad.fechaInicioOlimpiada).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              <strong>hasta</strong>{" "}
              {new Date(olympiad.fechaFinOlimpiada).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
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
                    onClick={() => openModal(area)}
                  >
                    <i className="bi bi-eye"></i> Ver más información
                  </button>
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

      <GenericModal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        {areaSeleccionada && (
          <>
            <h3>{areaSeleccionada.nombreArea}</h3>
            <p>{areaSeleccionada.descripcionArea}</p>
            <h4>Categorías:</h4>
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
          </>
        )}
      </GenericModal>

      <Footer />
    </div>
  );
};

export default OlimpiadaDetallada;
