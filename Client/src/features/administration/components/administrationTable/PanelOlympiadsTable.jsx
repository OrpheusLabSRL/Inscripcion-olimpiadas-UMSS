import React, { useState } from "react";
import "../../Styles/General.css";
import "../../Styles/ManageDocenteOlympiad.css";
import { FiEdit2, FiPlus, FiLayers } from "react-icons/fi";
import RegisterCategoriaModal from "../administrationModal/RegisterCategoriaModal";
import RegisterAreaModal from "../administrationModal/RegisterAreaModal";
import RegisterNewAreaModal from "../administrationModal/RegisterNewAreaModal";

export default function PanelOlympiadsTable({
  data,
  selectedVersion,
  onRefresh,
  onEditCategorias,
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

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h3 className="panel-title">Gestión de Áreas y Categorías</h3>

        <div className="tabs-container">
          <button
            className={`tab-button ${
              activeTab === "asignadas" ? "active" : ""
            }`}
            onClick={() => setActiveTab("asignadas")}
          >
            Asignadas
          </button>
          <button
            className={`tab-button ${activeTab === "nueva" ? "active" : ""}`}
            onClick={() => setActiveTab("nueva")}
          >
            Nueva Área
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-button primary" onClick={handleOpenAreaModal}>
          <FiLayers className="button-icon" />
          Asignar Área/Categoría
        </button>
      </div>

      {activeTab === "asignadas" && (
        <div className="table-responsive">
          <table className="data-table">
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
                      className={!hasCategories ? "inactive-row" : ""}
                    >
                      <td className="area-name">{area.nombreArea}</td>

                      <td className="categories-column">
                        {hasCategories ? (
                          area.categorias.map((categoria) => (
                            <div
                              key={`cat-${categoria.idCategoria}`}
                              className="category-item"
                            >
                              <div className="category-name">
                                {categoria.nombreCategoria}
                              </div>
                              <div className="grade-list">
                                {categoria.grados
                                  .map((g) => `${g.numeroGrado}° ${g.nivel}`)
                                  .join(", ")}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="no-categories">
                            Sin categorías asignadas
                          </span>
                        )}
                      </td>

                      <td className="text-right cost-column">
                        {hasCategories ? (
                          <div>
                            Bs {parseFloat(area.categorias[0].costo).toFixed(2)}
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            hasCategories ? "active" : "inactive"
                          }`}
                        >
                          {hasCategories ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="actions-column">
                        <button
                          onClick={() => handleEditModal(area.idArea)}
                          className="edit-button"
                          title="Editar categorías"
                          disabled={!hasCategories}
                        >
                          <FiEdit2 />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="empty-row">
                  <td colSpan="5">No hay áreas asignadas a esta olimpiada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "nueva" && (
        <div className="new-area-section">
          <RegisterNewAreaModal
            isOpen={isNewAreaModalOpen}
            onClose={() => setIsNewAreaModalOpen(false)}
            onSuccess={handleNewAreaSuccess}
          />
          <div className="info-card">
            <h4>Registrar nueva área</h4>
            <p>
              Para registrar una nueva área que no existe en el sistema, haz
              clic en el botón "Registrar Nueva Área".
            </p>
            <button
              className="action-button success"
              onClick={() => setIsNewAreaModalOpen(true)}
            >
              <FiPlus className="button-icon" />
              Registrar Nueva Área
            </button>
          </div>
        </div>
      )}

      {/* Modales */}
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
