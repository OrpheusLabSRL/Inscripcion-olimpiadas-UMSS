import React, { useState } from "react";
import "../../Styles/General.css";
import "../../Styles/ManageDocenteOlympiad.css";
import BaseDataModal from "../administrationModal/BaseDataModal";

export default function PanelOlympiadsTable({ data, selectedVersion }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpenModal = () => {
    setModalKey((prev) => prev + 1); // fuerza reinicio del formulario
    setIsModalOpen(true);
  };

  return (
    <div className="tabla-area-categoria">
      <div className="areas-title-container">
        <h3>Áreas y Categorías asignadas</h3>
        <button className="open-modal-button" onClick={handleOpenModal}>
          + Agregar Área/Categoría
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Área</th>
            <th>Categorías y Grados</th>
            <th style={{ width: "220px" }}>Docentes</th>
            <th style={{ width: "160px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((area) => (
            <tr key={`area-${area.idArea}`}>
              <td>{area.nombreArea}</td>
              <td>
                {area.categorias.map((categoria) => {
                  const gradosTexto = categoria.grados
                    .map((grado) => `${grado.numeroGrado}° ${grado.nivel}`)
                    .join(", ");

                  return (
                    <div
                      key={`cat-${categoria.idCategoria}`}
                      className="categoria-item"
                      style={{
                        marginBottom: "10px",
                        lineHeight: "1.4",
                      }}
                    >
                      <strong>{categoria.nombreCategoria}:</strong>{" "}
                      <span>{gradosTexto}</span>
                    </div>
                  );
                })}
              </td>
              <td
                style={{ width: "220px", color: "#666", fontStyle: "italic" }}
              >
                No asignado
              </td>
              <td style={{ width: "160px" }}></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal incluido aquí */}
      <BaseDataModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedVersion={parseInt(selectedVersion)}
        mode="add"
      />
    </div>
  );
}
