import React, { useState, useEffect } from "react";
import Dropdown from "../../components/Dropdown.jsx";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../Styles/ModalGeneral.css";
import "../../Styles/Dropdown.css";

import {
  getOlimpiadas,
  getAreas,
  getCategoriaGrado,
  asignarAreasYCategorias,
} from "../../../../api/Administration.api";

const ManageBaseDataModal = ({ isOpen, onClose }) => {
  const [version, setVersion] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState({});
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const olimpiadasData = await getOlimpiadas();
        const areasData = await getAreas();
        const categoriaGradoData = await getCategoriaGrado();

        const categoriaMap = new Map();
        categoriaGradoData.forEach((entry) => {
          const cat = entry.categoria;
          const grado = entry.grado;

          if (!categoriaMap.has(cat.idCategoria)) {
            categoriaMap.set(cat.idCategoria, {
              idCategoria: cat.idCategoria,
              nombreCategoria: cat.nombreCategoria,
              grados: [],
            });
          }

          if (grado) {
            categoriaMap.get(cat.idCategoria).grados.push(grado);
          }
        });

        setCategorias(Array.from(categoriaMap.values()));
        setOlimpiadas(olimpiadasData.data || []);
        setAreas(areasData || []);
      } catch (error) {
        console.error("Error al cargar datos base:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleCategoriaChange = (areaId, values) => {
    setSelectedCategorias((prev) => ({
      ...prev,
      [areaId]: values,
    }));
    setErrors((prev) => ({
      ...prev,
      [`categorias-${areaId}`]: "",
    }));
  };

  const handleReset = () => {
    setVersion("");
    setSelectedAreas([]);
    setSelectedCategorias({});
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!version) newErrors.version = "Debe seleccionar una versión";
    if (selectedAreas.length === 0)
      newErrors.areas = "Debe seleccionar al menos una área";

    selectedAreas.forEach((areaId) => {
      if (
        !selectedCategorias[areaId] ||
        selectedCategorias[areaId].length === 0
      ) {
        newErrors[`categorias-${areaId}`] =
          "Debe seleccionar al menos una categoría";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const confirmacion = window.confirm(
      "¿Está seguro de finalizar esta configuración?"
    );
    if (!confirmacion) return;

    const combinaciones = [];
    selectedAreas.forEach((idArea) => {
      (selectedCategorias[idArea] || []).forEach((idCategoria) => {
        combinaciones.push({
          idOlimpiada: parseInt(version),
          idArea,
          idCategoria,
        });
      });
    });

    try {
      await asignarAreasYCategorias(combinaciones);
      alert("¡Configuración guardada exitosamente!");
      handleReset();
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Ocurrió un error al guardar los datos.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: "850px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <button type="button" className="close-button" onClick={handleReset}>
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h3 className="section-title">
            Seleccionar la Versión de la Olimpiada
          </h3>
          <div className="dropdown-container">
            <Dropdown
              size="large"
              name="version"
              placeholder="Seleccione la versión de la Olimpiada"
              options={olimpiadas.map((o) => ({
                value: o.idOlimpiada,
                label: `Versión ${o.version}`,
              }))}
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
                setErrors((prev) => ({ ...prev, version: "" }));
              }}
              error={!!errors.version}
              errorMessage={errors.version}
            />
          </div>

          <p className="note" style={{ fontSize: "0.9rem" }}>
            <a href="#" style={{ color: "#2563eb" }}>
              Nota: Si desea añadir o modificar una nueva área o categoría
              contactarse con un administrador
            </a>
          </p>

          <h3 className="section-title">Áreas de la Olimpiada</h3>
          <div className="dropdown-container">
            <div className="dropdown-wrapper large">
              <MultiSelectDropdown
                label=""
                name="areas"
                placeholder="Seleccione las Áreas de la Olimpiada"
                options={areas.map((a) => ({
                  value: a.idArea,
                  label: a.nombreArea,
                }))}
                selectedValues={selectedAreas}
                onChange={(values) => {
                  setSelectedAreas(values);
                  setErrors((prev) => ({ ...prev, areas: "" }));
                }}
                error={!!errors.areas}
                errorMessage={errors.areas}
              />
            </div>
            {errors.areas && <p className="error-message">{errors.areas}</p>}
          </div>

          <h3 className="section-title">Categorías de la Olimpiada</h3>

          {selectedAreas.map((areaId) => {
            const area = areas.find((a) => a.idArea === areaId);
            const categoriasOptions = categorias.map((c) => ({
              value: c.idCategoria,
              label: c.nombreCategoria,
            }));

            const categoriasSeleccionadas = categorias.filter((c) =>
              selectedCategorias[areaId]?.includes(c.idCategoria)
            );

            return (
              <div
                key={areaId}
                className="field-group inline"
                style={{ marginBottom: "1.5rem" }}
              >
                <label
                  className="dropdown-label"
                  style={{ minWidth: "120px", marginRight: "1rem" }}
                >
                  {area?.nombreArea}
                  <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
                </label>
                <div style={{ flex: 1 }}>
                  <div
                    className={`dropdown-wrapper large ${
                      errors[`categorias-${areaId}`] ? "error-border" : ""
                    }`}
                  >
                    <MultiSelectDropdown
                      label=""
                      name={`categorias-${areaId}`}
                      placeholder="Seleccione las Categoría de la Área"
                      options={categoriasOptions}
                      selectedValues={selectedCategorias[areaId] || []}
                      onChange={(values) =>
                        handleCategoriaChange(areaId, values)
                      }
                    />
                  </div>

                  {errors[`categorias-${areaId}`] && (
                    <p className="error-message">
                      {errors[`categorias-${areaId}`]}
                    </p>
                  )}

                  {categoriasSeleccionadas.length > 0 && (
                    <ul
                      style={{
                        margin: "0.5rem 0 0 0",
                        fontSize: "0.85rem",
                        color: "#333",
                        paddingLeft: "1rem",
                      }}
                    >
                      {categoriasSeleccionadas.map((cat) => (
                        <li key={cat.idCategoria}>
                          {cat.grados && cat.grados.length > 0 && (
                            <>
                              <strong>{cat.nombreCategoria}</strong>{" "}
                              <span style={{ color: "#666" }}>
                                (
                                {cat.grados
                                  .map(
                                    (g) =>
                                      `${g.numeroGrado}° de ${g.nivel}` ||
                                      g.nombreGrado
                                  )
                                  .join(", ")}
                                )
                              </span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}

          <div
            className="modal-actions"
            style={{ justifyContent: "flex-end", marginTop: "2rem" }}
          >
            <button type="submit" className="save-button">
              REGISTRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageBaseDataModal;
