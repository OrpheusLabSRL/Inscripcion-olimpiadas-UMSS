import React, { useState } from "react";
import { FiEdit2, FiPlus, FiLayers } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import RegisterCategoriaModal from "../administrationModal/RegisterCategoriaModal";
import RegisterNewCategoriaModal from "../administrationModal/RegisterNewCategoriaModal";
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
  const [isNewCategoriaModalOpen, setIsNewCategoriaModalOpen] = useState(false);
  const [isEditCategoriaModalOpen, setIsEditCategoriaModalOpen] =
    useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isNewAreaModalOpen, setIsNewAreaModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [activeTab, setActiveTab] = useState("asignadas");

  const handleOpenAreaModal = () => {
    setModalKey((prev) => prev + 1);
    setIsAreaModalOpen(true);
  };

  const handleOpenEditCategoriaModal = (areaId) => {
    setModalKey((prev) => prev + 1);
    setSelectedAreaId(areaId);
    setIsEditCategoriaModalOpen(true);
  };

  const handleOpenNewCategoriaModal = () => {
    setModalKey((prev) => prev + 1);
    setSelectedAreaId(null); // No hay área seleccionada al registrar nueva categoría
    setIsNewCategoriaModalOpen(true);
  };

  const handleNewAreaSuccess = () => {
    setIsNewAreaModalOpen(false);
    if (onRefresh) onRefresh();
  };

  const fechaInicio = new Date(fechaInicioOlimpiada);
  const hasStarted = !isNaN(fechaInicio.getTime()) && fechaInicio <= new Date();

  return (
    <div className="panelOlympiadContainer">
      <div className="panelOlympiadHeader">
        <div className="tooltipWrapper">
          <button
            className={`panelOlympiadBtn primary ${
              hasStarted ? "disabledBtn" : ""
            }`}
            onClick={handleOpenAreaModal}
            disabled={hasStarted}
            aria-describedby="tooltip-assign"
          >
            <FiLayers className="buttonIcon" />
            Asignar Áreas y Categorías
          </button>
          {hasStarted && (
            <div id="tooltip-assign" role="tooltip" className="tooltipText">
              No se puede asignar áreas porque la olimpiada ya comenzó o no está
              activa
              <div className="tooltipArrow"></div>
            </div>
          )}
        </div>

        <div className="panelOlympiadTabs">
          <button
            className={`panelOlympiadTab ${
              activeTab === "asignadas" ? "active" : ""
            }`}
            onClick={() => setActiveTab("asignadas")}
          >
            Asignadas
          </button>
          <button
            className={`panelOlympiadTab ${
              activeTab === "nueva" ? "active" : ""
            }`}
            onClick={() => setActiveTab("nueva")}
          >
            Nueva Área
          </button>
          <button
            className={`panelOlympiadTab ${
              activeTab === "nuevaCategoria" ? "active" : ""
            }`}
            onClick={() => setActiveTab("nuevaCategoria")}
          >
            Nueva Categoría
          </button>
        </div>
      </div>

      {activeTab === "asignadas" && (
        <div className="panelOlympiadTableWrapper">
          <table className="panelOlympiadTable">
            <thead>
              <tr>
                <th>Área</th>
                <th>Categorías y Grados</th>
                <th className="textRight">Costo</th>
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
                      className={!hasCategories ? "panelOlympiadInactive" : ""}
                    >
                      <td className="panelOlympiadArea">{area.nombreArea}</td>
                      <td className="panelOlympiadCategories">
                        {hasCategories ? (
                          area.categorias.map((categoria) => (
                            <div
                              key={`cat-${categoria.idCategoria}`}
                              className="panelOlympiadCategoryItem"
                            >
                              <div className="panelOlympiadCategoryName">
                                {categoria.nombreCategoria}
                              </div>
                              <div className="panelOlympiadGradeList">
                                {categoria.grados
                                  .map((g) => `${g.numeroGrado}° ${g.nivel}`)
                                  .join(", ")}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="panelOlympiadNoCategories">
                            <span>Sin categorías asignadas</span>
                            {!hasStarted && (
                              <button
                                className="panelOlympiadBtn small success"
                                onClick={() =>
                                  handleOpenEditCategoriaModal(area.idArea)
                                }
                              >
                                <FiPlus className="buttonIcon" />
                                Agregar Categoría
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="textRight panelOlympiadCost">
                        {hasCategories
                          ? `Bs ${parseFloat(area.categorias[0].costo).toFixed(
                              2
                            )}`
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`panelOlympiadStatus ${
                            hasCategories ? "active" : "inactive"
                          }`}
                        >
                          {hasCategories ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="panelOlympiadActionsCol">
                        <div className="tooltipWrapper">
                          <button
                            onClick={() =>
                              handleOpenEditCategoriaModal(area.idArea)
                            }
                            className={`panelOlympiadEditBtn ${
                              !hasCategories || hasStarted ? "disabledBtn" : ""
                            }`}
                            disabled={!hasCategories || hasStarted}
                            aria-describedby={`tooltip-edit-${area.idArea}`}
                          >
                            <FiEdit2 />
                          </button>
                          {(!hasCategories || hasStarted) && (
                            <div
                              id={`tooltip-edit-${area.idArea}`}
                              role="tooltip"
                              className="tooltipText"
                            >
                              {!hasCategories
                                ? "No se puede editar: No hay categorías asignadas"
                                : "No se puede editar: La olimpiada ya comenzó"}
                              <div className="tooltipArrow"></div>
                            </div>
                          )}
                          <FaTrash className="actionIcon deleteIcon" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="panelOlympiadEmptyRow">
                  <td colSpan="5">No hay áreas asignadas a esta olimpiada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "nueva" && (
        <div className="panelOlympiadNewArea">
          <RegisterNewAreaModal
            isOpen={isNewAreaModalOpen}
            onClose={() => setIsNewAreaModalOpen(false)}
            onSuccess={handleNewAreaSuccess}
          />
          <div className="panelOlympiadInfoCard">
            <h4>Registrar nueva área</h4>
            <p>
              Para registrar una nueva área que no existe en el sistema, haz
              clic en el botón "Registrar Nueva Área".
            </p>
            <div className="tooltipWrapper">
              <button
                className={`panelOlympiadBtn success ${
                  hasStarted ? "disabledBtn" : ""
                }`}
                onClick={() => setIsNewAreaModalOpen(true)}
                disabled={hasStarted}
                aria-describedby="tooltip-register"
              >
                <FiPlus className="buttonIcon" />
                Registrar Nueva Área
              </button>
              {hasStarted && (
                <div
                  id="tooltip-register"
                  role="tooltip"
                  className="tooltipText"
                >
                  No se puede registrar porque la olimpiada ya comenzó o no está
                  activa
                  <div className="tooltipArrow"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "nuevaCategoria" && (
        <div className="panelOlympiadNewArea">
          <div className="panelOlympiadInfoCard">
            <h4>Registrar nueva categoría</h4>
            <p>
              Para registrar una nueva categoría desde cero, haz clic en el
              botón "Registrar Nueva Categoría".
            </p>
            <div className="tooltipWrapper">
              <button
                className={`panelOlympiadBtn success ${
                  hasStarted ? "disabledBtn" : ""
                }`}
                onClick={handleOpenNewCategoriaModal}
                disabled={hasStarted}
                aria-describedby="tooltip-register-cat"
              >
                <FiPlus className="buttonIcon" />
                Registrar Nueva Categoría
              </button>
              {hasStarted && (
                <div
                  id="tooltip-register-cat"
                  role="tooltip"
                  className="tooltipText"
                >
                  No se puede registrar porque la olimpiada ya comenzó o no está
                  activa
                  <div className="tooltipArrow"></div>
                </div>
              )}
            </div>
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

      <RegisterNewCategoriaModal
        key={`new-cat-${modalKey}`}
        isOpen={isNewCategoriaModalOpen}
        onClose={() => setIsNewCategoriaModalOpen(false)}
        selectedVersion={parseInt(selectedVersion)}
        onSuccess={onRefresh}
      />

      <RegisterCategoriaModal
        key={`edit-cat-${modalKey}`}
        isOpen={isEditCategoriaModalOpen}
        onClose={() => setIsEditCategoriaModalOpen(false)}
        selectedVersion={parseInt(selectedVersion)}
        selectedAreaId={selectedAreaId}
        onSuccess={onRefresh}
      />
    </div>
  );
}
