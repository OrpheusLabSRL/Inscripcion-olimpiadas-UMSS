import React, { useEffect, useState } from "react";
import "../styles/ModalGeneral.css";
import { getAreasCategoriasPorOlimpiada } from "../../../api/Administration.api";

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

          console.log("📦 Datos procesados:", data);

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

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px" }}>
        <button type="button" className="close-button" onClick={onClose}>
          ✖
        </button>

        <h2 className="modal-title">Datos generales de la Olimpiada</h2>

        <div className="form-group">
          <p>
            <strong>Nombre:</strong> {olimpiada.nombreOlimpiada}
          </p>
          <p>
            <strong>Versión:</strong> {olimpiada.version}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {olimpiada.fechaInicioOlimp}
          </p>
          <p>
            <strong>Fecha de Fin:</strong> {olimpiada.fechaFinOlimp}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {olimpiada.estadoOlimpiada ? "Activo" : "Finalizado"}
          </p>
        </div>

        <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          Áreas y Categorías
        </h3>

        {Object.entries(agrupado).map(([areaId, area]) => (
          <div className="area-relacionada" key={areaId}>
            <div className="area-box">
              <strong>Área:</strong> {area.nombreArea}
            </div>
            <div className="categoria-box">
              <strong>Categorías:</strong>
              <ul>
                {area.categorias.map((cat) => (
                  <li key={cat.idCategoria}>{cat.nombreCategoria}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OlympiadsModal;
