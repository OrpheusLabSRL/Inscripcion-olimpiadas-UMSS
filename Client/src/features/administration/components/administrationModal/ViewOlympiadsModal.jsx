import React, { useEffect, useState } from "react";
import { getAreasCategoriasPorOlimpiada } from "../../../../api/Administration.api";
import "../../Styles/ModalGeneral.css";

const OlympiadsModal = ({ isOpen, onClose, olimpiada }) => {
  const [agrupado, setAgrupado] = useState({});

  useEffect(() => {
    const fetchRelacionadas = async () => {
      if (olimpiada?.idOlimpiada) {
        try {
          const response = await getAreasCategoriasPorOlimpiada(
            olimpiada.idOlimpiada
          );
          const data = Array.isArray(response) ? response : response.data || [];

          const agrupadoPorArea = Object.fromEntries(
            data.map((area) => [
              area.idArea,
              {
                nombreArea: area.nombreArea,
                categorias: area.categorias,
              },
            ])
          );

          setAgrupado(agrupadoPorArea);
        } catch (error) {
          console.error("Error al cargar áreas y categorías:", error);
        }
      }
    };

    fetchRelacionadas();
  }, [olimpiada]);

  if (!isOpen || !olimpiada) return null;

  const agruparGrados = (grados) => {
    const grupos = [];
    for (let i = 0; i < grados.length; i += 5) {
      grupos.push(grados.slice(i, i + 5));
    }
    return grupos;
  };

  const obtenerEstadoOlimpiada = (estadoOlimpiada, fechaInicio, fechaFin) => {
    const ahora = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (ahora > fin) {
      return "Finalizado";
    }

    if (!estadoOlimpiada && ahora >= inicio && ahora <= fin) {
      return "Inactivo";
    }

    if (estadoOlimpiada && ahora < inicio) {
      return "Pendiente (Todavia no inicia)";
    }

    if (estadoOlimpiada && ahora >= inicio && ahora <= fin) {
      return "En proceso";
    }

    // Caso por defecto:
    return estadoOlimpiada ? "Activo" : "Inactivo";
  };

  return (
    <div className="adminModalOverlay">
      <div
        className="adminModalContent"
        style={{ maxWidth: "850px", padding: "1.5rem" }}
      >
        <button
          type="button"
          className="adminModalCloseBtn"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✖
        </button>

        <h2 className="adminModalTitle" style={{ marginBottom: "1rem" }}>
          Datos generales de la Olimpiada
        </h2>

        <div className="adminOlympiadInfo">
          <p>
            <strong>Nombre:</strong> {olimpiada.nombreOlimpiada}
          </p>
          <p>
            <strong>Versión:</strong> {olimpiada.version}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {olimpiada.fechaInicioOlimpiada}
          </p>
          <p>
            <strong>Fecha de Fin:</strong> {olimpiada.fechaFinOlimpiada}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {obtenerEstadoOlimpiada(
              olimpiada.estadoOlimpiada,
              olimpiada.fechaInicioOlimpiada,
              olimpiada.fechaFinOlimpiada
            )}
          </p>
        </div>

        <h3 className="adminSectionTitle">Áreas y Categorías</h3>

        <div className="adminAreaCategoriasContainer">
          {Object.keys(agrupado).length > 0 ? (
            Object.entries(agrupado).map(([areaId, area]) => (
              <div className="adminAreaCategoriaCard" key={areaId}>
                <div className="adminAreaInfo">
                  <strong>Área:</strong> {area.nombreArea}
                </div>
                <div className="adminCategoriaInfo">
                  <strong>Categorías:</strong>
                  <ul className="adminCategoriaList">
                    {area.categorias.map((cat) => (
                      <li key={cat.idCategoria}>
                        {cat.nombreCategoria}
                        {cat.grados && cat.grados.length > 0 && (
                          <>
                            {" "}
                            (
                            {agruparGrados(cat.grados).map((grupo, index) => (
                              <React.Fragment key={index}>
                                {grupo
                                  .map(
                                    (grado) =>
                                      `${grado.numeroGrado}° ${grado.nivel}`
                                  )
                                  .join(", ")}
                                {index <
                                  agruparGrados(cat.grados).length - 1 && (
                                  <br />
                                )}
                              </React.Fragment>
                            ))}
                            )
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="adminEmptyState">
              No existen Áreas ni Categorías registradas en esta Olimpiada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OlympiadsModal;
