import React, { useEffect, useState } from "react";
import "../../Styles/ModalGeneral.css";
import { getAreasCategoriasPorOlimpiada } from "../../../../api/Administration.api";

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
          console.error("❌ Error al cargar áreas y categorías:", error);
        }
      }
    };

    fetchRelacionadas();
  }, [olimpiada]);

  if (!isOpen || !olimpiada) return null;

  // 👉 Agrupar grados de 3 en 3
  const agruparGrados = (grados) => {
    const grupos = [];
    for (let i = 0; i < grados.length; i += 3) {
      grupos.push(grados.slice(i, i + 3));
    }
    return grupos;
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: "850px", padding: "1.5rem" }}
      >
        <button type="button" className="close-button" onClick={onClose}>
          ✖
        </button>

        <h2 className="modal-title" style={{ marginBottom: "1rem" }}>
          Datos generales de la Olimpiada
        </h2>

        <div
          className="form-group"
          style={{ marginBottom: "1.2rem", lineHeight: "1.4" }}
        >
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Nombre:</strong> {olimpiada.nombreOlimpiada}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Versión:</strong> {olimpiada.version}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Fecha de Inicio:</strong> {olimpiada.fechaInicioOlimpiada}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Fecha de Fin:</strong> {olimpiada.fechaFinOlimpiada}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Estado:</strong>{" "}
            {olimpiada.estadoOlimpiada ? "Activo" : "Finalizado"}
          </p>
        </div>

        <h3 style={{ margin: "1.2rem 0 0.75rem" }}>Áreas y Categorías</h3>

        <div
          className="area-categorias-container"
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {Object.keys(agrupado).length > 0 ? (
            Object.entries(agrupado).map(([areaId, area]) => (
              <div
                className="area-categoria-box"
                key={areaId}
                style={{
                  padding: "0.6rem 0.8rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor: "#D8D7BC",
                }}
              >
                <div className="area-info" style={{ marginBottom: "0.4rem" }}>
                  <strong>Área:</strong> {area.nombreArea}
                </div>
                <div className="categoria-info">
                  <strong>Categorías:</strong>
                  <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem" }}>
                    {area.categorias.map((cat) => (
                      <li
                        key={cat.idCategoria}
                        style={{ marginBottom: "0.25rem" }}
                      >
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
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#D8D7BC",
                borderRadius: "6px",
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No existen Áreas ni Categorías registradas en esta Olimpiada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OlympiadsModal;
