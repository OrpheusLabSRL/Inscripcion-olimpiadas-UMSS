import React, { useEffect, useState } from "react";
import { getAreasCategoriasPorOlimpiada } from "../../../../api/Administration.api";
import "../../styles/ModalGeneral.css";

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
    for (let i = 0; i < grados.length; i += 3) {
      grupos.push(grados.slice(i, i + 3));
    }
    return grupos;
  };

  return (
    <div className="admin-modal-overlay">
      <div
        className="admin-modal-content"
        style={{ maxWidth: "850px", padding: "1.5rem" }}
      >
        <button
          type="button"
          className="admin-modal-close-btn"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="admin-modal-title" style={{ marginBottom: "1rem" }}>
          Datos generales de la Olimpiada
        </h2>

        <div className="admin-olympiad-info">
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
            {olimpiada.estadoOlimpiada ? "Activo" : "Finalizado"}
          </p>
        </div>

        <h3 className="admin-section-title">Áreas y Categorías</h3>

        <div className="admin-area-categorias-container">
          {Object.keys(agrupado).length > 0 ? (
            Object.entries(agrupado).map(([areaId, area]) => (
              <div className="admin-area-categoria-card" key={areaId}>
                <div className="admin-area-info">
                  <strong>Área:</strong> {area.nombreArea}
                </div>
                <div className="admin-categoria-info">
                  <strong>Categorías:</strong>
                  <ul className="admin-categoria-list">
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
            <div className="admin-empty-state">
              No existen Áreas ni Categorías registradas en esta Olimpiada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OlympiadsModal;
