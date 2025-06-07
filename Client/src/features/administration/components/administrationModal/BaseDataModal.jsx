import React, { useState, useEffect } from "react";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../styles/Dropdown.css";
import "../../styles/ModalGeneral.css";

import {
  getOlimpiadas,
  getAreas,
  getCategoriaGrado,
  getAreasCategoriasPorOlimpiada,
  asignarAreasYCategorias,
} from "../../../../api/Administration.api";

const ManageBaseDataModal = ({ isOpen, onClose, selectedVersion }) => {
  const [version, setVersion] = useState("");
  const [versionLabel, setVersionLabel] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState({});
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [initialState, setInitialState] = useState({
    areas: [],
    categorias: {},
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [olimpiadasData, areasData, categoriaGradoData] =
          await Promise.all([getOlimpiadas(), getAreas(), getCategoriaGrado()]);

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

        setAreas(areasData || []);
        setCategorias(Array.from(categoriaMap.values()));

        const selectedOlimpiad = olimpiadasData.data.find(
          (o) => o.idOlimpiada === selectedVersion
        );
        if (selectedOlimpiad) {
          setVersionLabel(selectedOlimpiad.version);
        }

        setVersion(selectedVersion);
      } catch (error) {
        console.error("Error cargando datos base:", error);
      }
    };

    fetchData();
  }, [isOpen, selectedVersion]);

  useEffect(() => {
    const cargarAsignacionesPrevias = async () => {
      if (!version) return;

      try {
        const response = await getAreasCategoriasPorOlimpiada(version);
        const data = Array.isArray(response) ? response : response.data || [];

        const areasAsignadas = data.map((area) => area.idArea);
        const categoriasAsignadas = {};

        data.forEach((area) => {
          categoriasAsignadas[area.idArea] = area.categorias.map(
            (cat) => cat.idCategoria
          );
        });

        setSelectedAreas(areasAsignadas);
        setSelectedCategorias(categoriasAsignadas);

        setInitialState({
          areas: areasAsignadas,
          categorias: categoriasAsignadas,
        });
      } catch (error) {
        console.error("Error cargando áreas y categorías existentes:", error);
      }
    };

    if (isOpen && version) {
      cargarAsignacionesPrevias();
    }
  }, [isOpen, version]);

  const handleCategoriaChange = (areaId, values) => {
    setSelectedCategorias((prev) => ({
      ...prev,
      [areaId]: values,
    }));
    setErrors((prev) => ({
      ...prev,
      [`categorias${areaId}`]: "",
    }));
  };

  const handleReset = () => {
    setVersion("");
    setVersionLabel("");
    setSelectedAreas([]);
    setSelectedCategorias({});
    setAreas([]);
    setCategorias([]);
    setErrors({});
    setInitialState({ areas: [], categorias: {} });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!version) newErrors.version = "Debe seleccionar una versión";
    if (selectedAreas.length === 0)
      newErrors.areas = "Debe seleccionar al menos un área";

    selectedAreas.forEach((areaId) => {
      if (
        !selectedCategorias[areaId] ||
        selectedCategorias[areaId].length === 0
      ) {
        newErrors[`categorias${areaId}`] =
          "Debe seleccionar al menos una categoría";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const confirmacion = window.confirm(
      "¿Está seguro de guardar esta configuración?"
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
      await deleteAreasCategoriasPorOlimpiada(version);

      if (combinaciones.length > 0) {
        await asignarAreasYCategorias(combinaciones);
      }

      alert("¡Configuración actualizada exitosamente!");
      handleReset();
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Ocurrió un error al guardar los datos.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay">
      <div
        className="adminModalContent"
        style={{ maxWidth: "850px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <button
          type="button"
          className="adminModalCloseBtn"
          onClick={handleReset}
        >
          ✖
        </button>

        <form onSubmit={handleSubmit} className="adminModalForm">
          <h3 className="adminModalTitle">Versión Seleccionada</h3>
          <div className="adminVersionDisplay">
            {versionLabel ? `Versión ${versionLabel}` : "Versión no disponible"}
          </div>

          <h3 className="adminModalTitle">Áreas de la Olimpiada</h3>
          <div className="adminDropdownContainer">
            <div className="adminDropdownWrapper large">
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
          </div>

          <h3 className="adminModalTitle">Categorías de la Olimpiada</h3>

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
                className="adminFormGroup"
                style={{ marginBottom: "1.5rem" }}
              >
                <label className="adminFormLabel">
                  {area?.nombreArea}
                  <span className="adminRequiredField">*</span>
                </label>
                <div style={{ flex: 1 }}>
                  <div
                    className={`adminDropdownWrapper large ${
                      errors[`categorias${areaId}`] ? "adminInputError" : ""
                    }`}
                  >
                    <MultiSelectDropdown
                      label=""
                      name={`categorias${areaId}`}
                      placeholder="Seleccione las Categorías del Área"
                      options={categoriasOptions}
                      selectedValues={selectedCategorias[areaId] || []}
                      onChange={(values) =>
                        handleCategoriaChange(areaId, values)
                      }
                    />
                  </div>

                  {errors[`categorias${areaId}`] && (
                    <p className="adminErrorMessage">
                      {errors[`categorias${areaId}`]}
                    </p>
                  )}

                  {categoriasSeleccionadas.length > 0 && (
                    <ul className="adminCategoriaList">
                      {categoriasSeleccionadas.map((cat) => (
                        <li key={cat.idCategoria}>
                          <strong>{cat.nombreCategoria}</strong>{" "}
                          {cat.grados && cat.grados.length > 0 && (
                            <span className="adminGradoText">
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
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}

          <div className="adminModalActions">
            <button type="submit" className="adminModalBtnSave">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageBaseDataModal;
