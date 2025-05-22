import React, { useState } from "react";
import { FiEdit2, FiPlus, FiLayers } from "react-icons/fi";
import RegisterCategoriaModal from "../administrationModal/RegisterCategoriaModal";
import RegisterAreaModal from "../administrationModal/RegisterAreaModal";
import RegisterNewAreaModal from "../administrationModal/RegisterNewAreaModal";
import "../../Styles/Tables.css";

export default function PanelOlympiadsTable({
  data,
  selectedVersion,
  fechaInicioOlimpiada,
  onRefresh,
}) {
  const [modalKey, setModalKey] = useState(0);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isNewAreaModalOpen, setIsNewAreaModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [activeTab, setActiveTab] = useState("asignadas");

  const handleOpenAreaModal = () => {
    setModalKey((prev) => prev + 1);
    setIsAreaModalOpen(true);
  };

  const handleEditModal = (areaId) => {
    setModalKey((prev) => prev + 1);
    setSelectedAreaId(areaId);
    setIsCategoriaModalOpen(true);
  };

  const handleNewAreaSuccess = () => {
    setIsNewAreaModalOpen(false);
    if (onRefresh) onRefresh();
  };

  // Validar fecha de inicio
  const fechaInicio = new Date(fechaInicioOlimpiada);
  const hasStarted = !isNaN(fechaInicio.getTime()) && fechaInicio <= new Date();

  return (
    <div className="panel-olympiad-container">
      <div className="panel-olympiad-header">
        <button
          className="panel-olympiad-btn primary"
          onClick={handleOpenAreaModal}
          disabled={hasStarted}
        >
          <FiLayers className="button-icon" />
          Asignar Áreas y Categorías
        </button>

        <div className="panel-olympiad-tabs">
          <button
            className={`panel-olympiad-tab ${
              activeTab === "asignadas" ? "active" : ""
            }`}
            onClick={() => setActiveTab("asignadas")}
          >
            Asignadas
          </button>
          <button
            className={`panel-olympiad-tab ${
              activeTab === "nueva" ? "active" : ""
            }`}
            onClick={() => setActiveTab("nueva")}
          >
            Nueva Área
          </button>
        </div>
      </div>

      <div className="panel-olympiad-actions"></div>

      {activeTab === "asignadas" && (
        <div className="panel-olympiad-table-wrapper">
          <table className="panel-olympiad-table">
            <thead>
              <tr>
                <th>Área</th>
                <th>Categorías y Grados</th>
                <th className="text-right">Costo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((area) => {
                  const hasCategories = area.categorias.length > 0;

                  return (
                    <tr
                      key={`area-${area.idArea}`}
                      className={
                        !hasCategories ? "panel-olympiad-inactive" : ""
                      }
                    >
                      <td className="panel-olympiad-area">{area.nombreArea}</td>
                      <td className="panel-olympiad-categories">
                        {hasCategories ? (
                          area.categorias.map((categoria) => (
                            <div
                              key={`cat-${categoria.idCategoria}`}
                              className="panel-olympiad-category-item"
                            >
                              <div className="panel-olympiad-category-name">
                                {categoria.nombreCategoria}
                              </div>
                              <div className="panel-olympiad-grade-list">
                                {categoria.grados
                                  .map((g) => `${g.numeroGrado}° ${g.nivel}`)
                                  .join(", ")}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="panel-olympiad-no-categories">
                            Sin categorías asignadas
                          </span>
                        )}
                      </td>
                      <td className="text-right panel-olympiad-cost">
                        {hasCategories
                          ? `Bs ${parseFloat(area.categorias[0].costo).toFixed(
                              2
                            )}`
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`panel-olympiad-status ${
                            hasCategories ? "active" : "inactive"
                          }`}
                        >
                          {hasCategories ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="panel-olympiad-actions-col">
                        <button
                          onClick={() => handleEditModal(area.idArea)}
                          className="panel-olympiad-edit-btn"
                          title="Editar categorías"
                          disabled={!hasCategories || hasStarted}
                        >
                          <FiEdit2 />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="panel-olympiad-empty-row">
                  <td colSpan="5">No hay áreas asignadas a esta olimpiada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "nueva" && (
        <div className="panel-olympiad-new-area">
          <RegisterNewAreaModal
            isOpen={isNewAreaModalOpen}
            onClose={() => setIsNewAreaModalOpen(false)}
            onSuccess={handleNewAreaSuccess}
          />
          <div className="panel-olympiad-info-card">
            <h4>Registrar nueva área</h4>
            <p>
              Para registrar una nueva área que no existe en el sistema, haz
              clic en el botón "Registrar Nueva Área".
            </p>
            <button
              className="panel-olympiad-btn success"
              onClick={() => setIsNewAreaModalOpen(true)}
              disabled={hasStarted}
            >
              <FiPlus className="button-icon" />
              Registrar Nueva Área
            </button>
          </div>
        </div>
      )}

      <RegisterAreaModal
        key={`area-${modalKey}`}
        isOpen={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        selectedVersion={parseInt(selectedVersion)}
        onSuccess={onRefresh}
      />

      <RegisterCategoriaModal
        key={`cat-${modalKey}`}
        isOpen={isCategoriaModalOpen}
        onClose={() => setIsCategoriaModalOpen(false)}
        selectedVersion={parseInt(selectedVersion)}
        selectedAreaId={selectedAreaId}
        onSuccess={onRefresh}
      />
    </div>
  );
}
