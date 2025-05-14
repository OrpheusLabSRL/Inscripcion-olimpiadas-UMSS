import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../Styles/ModalGeneral.css";
import "../../Styles/Dropdown.css";

import {
  getOlimpiadas,
  getAreas,
  getCategoriaGrado,
  getAreasCategoriasPorOlimpiada,
  asignarAreasYCategorias,
  deleteAreaCategoriaByOlimpiadaAndArea,
} from "../../../../api/Administration.api";

const RegisterCategoriaModal = ({
  isOpen,
  onClose,
  selectedVersion,
  selectedAreaId,
}) => {
  const [version, setVersion] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState({});
  const [costoPorArea, setCostoPorArea] = useState({});
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
        const [_, areasData, categoriaGradoData] = await Promise.all([
          getOlimpiadas(),
          getAreas(),
          getCategoriaGrado(),
        ]);

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
        setVersion(selectedVersion);
        if (selectedAreaId) {
          setSelectedAreas([selectedAreaId]);
        }
      } catch (error) {
        console.error("Error cargando datos base:", error);
      }
    };

    fetchData();
  }, [isOpen, selectedVersion, selectedAreaId]);

  useEffect(() => {
    const cargarAsignacionesPrevias = async () => {
      if (!version) return;

      try {
        const response = await getAreasCategoriasPorOlimpiada(version);
        const data = Array.isArray(response) ? response : response.data || [];

        const areasAsignadas = data.map((area) => area.idArea);
        const categoriasAsignadas = {};
        const costos = {};

        data.forEach((area) => {
          categoriasAsignadas[area.idArea] = area.categorias.map(
            (cat) => cat.idCategoria
          );
          if (area.categorias.length > 0) {
            costos[area.idArea] = area.categorias[0].costo;
          }
        });

        setInitialState({
          areas: areasAsignadas,
          categorias: categoriasAsignadas,
        });

        if (!selectedAreaId) {
          setSelectedAreas(areasAsignadas);
          setSelectedCategorias(categoriasAsignadas);
        } else {
          setSelectedCategorias({
            [selectedAreaId]: categoriasAsignadas[selectedAreaId] || [],
          });
          setCostoPorArea({
            [selectedAreaId]: costos[selectedAreaId] || "0.00",
          });
        }
      } catch (error) {
        console.error("Error cargando áreas y categorías existentes:", error);
      }
    };

    if (isOpen && version) {
      cargarAsignacionesPrevias();
    }
  }, [isOpen, version, selectedAreaId]);

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
    setAreas([]);
    setCategorias([]);
    setErrors({});
    setInitialState({ areas: [], categorias: {} });
    setCostoPorArea({});
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
        newErrors[`categorias-${areaId}`] =
          "Debe seleccionar al menos una categoría";
      }

      const costo = costoPorArea[areaId];
      if (costo === undefined || isNaN(costo) || parseFloat(costo) < 0) {
        newErrors[`costo-${areaId}`] = "Costo inválido";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Por favor corrige los errores antes de guardar.");
      return;
    }

    const confirmacion = window.confirm(
      "¿Está seguro de guardar esta configuración?"
    );
    if (!confirmacion) return;

    const combinaciones = [];
    selectedAreas.forEach((idArea) => {
      const costo = parseFloat(costoPorArea[idArea]) || 0;
      (selectedCategorias[idArea] || []).forEach((idCategoria) => {
        combinaciones.push({
          idOlimpiada: version,
          idArea,
          idCategoria,
          costo,
        });
      });
    });

    try {
      for (const idArea of selectedAreas) {
        await deleteAreaCategoriaByOlimpiadaAndArea(version, idArea);
      }

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
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: "850px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <button type="button" className="close-button" onClick={handleReset}>
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h3 className="section-title" style={{ color: "#000" }}>
            Categorías de la Olimpiada
          </h3>

          {selectedAreas.map((areaId) => {
            const area = areas.find((a) => a.idArea === areaId);
            const yaAsignadas = initialState.categorias[areaId] || [];
            const categoriasDisponibles = categorias.filter(
              (cat) => !yaAsignadas.includes(cat.idCategoria)
            );
            const categoriasOptions = categoriasDisponibles.map((c) => ({
              value: c.idCategoria,
              label:
                c.nombreCategoria +
                (c.grados?.length > 0
                  ? ` (${c.grados
                      .map((g) => `${g.numeroGrado}° ${g.nivel}`)
                      .join(", ")})`
                  : ""),
            }));
            const categoriasSeleccionadas = categorias.filter((c) =>
              selectedCategorias[areaId]?.includes(c.idCategoria)
            );

            return (
              <div
                key={areaId}
                className="field-group"
                style={{ marginBottom: "1.5rem" }}
              >
                <label className="dropdown-label">
                  Área: <strong>{area?.nombreArea}</strong>
                </label>

                <label style={{ marginTop: "0.5rem" }}>
                  Costo por categoría (Bs):
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costoPorArea[areaId] || ""}
                    onChange={(e) =>
                      setCostoPorArea((prev) => ({
                        ...prev,
                        [areaId]: e.target.value,
                      }))
                    }
                    className={`form-input ${
                      errors[`costo-${areaId}`] ? "input-error" : ""
                    }`}
                    style={{
                      marginLeft: "1rem",
                      padding: "0.3rem",
                      width: "120px",
                    }}
                  />
                </label>
                {errors[`costo-${areaId}`] && (
                  <p className="error-message">
                    <FiAlertCircle /> {errors[`costo-${areaId}`]}
                  </p>
                )}

                <div
                  className={`dropdown-wrapper large ${
                    errors[`categorias-${areaId}`] ? "input-error" : ""
                  }`}
                  style={{ marginTop: "1rem" }}
                >
                  <MultiSelectDropdown
                    label=""
                    name={`categorias-${areaId}`}
                    placeholder="Seleccione las Categorías del Área"
                    options={categoriasOptions}
                    selectedValues={selectedCategorias[areaId] || []}
                    onChange={(values) => handleCategoriaChange(areaId, values)}
                  />
                </div>

                {errors[`categorias-${areaId}`] && (
                  <p className="error-message">
                    <FiAlertCircle /> {errors[`categorias-${areaId}`]}
                  </p>
                )}

                {categoriasSeleccionadas.length > 0 && (
                  <ul
                    style={{
                      marginTop: "0.75rem",
                      paddingLeft: "1.25rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {categoriasSeleccionadas.map((cat) => (
                      <li key={cat.idCategoria}>
                        <strong>{cat.nombreCategoria}</strong>{" "}
                        {cat.grados?.length > 0 && (
                          <span style={{ color: "#666" }}>
                            (
                            {cat.grados
                              .map(
                                (g) =>
                                  `${g.numeroGrado}° ${g.nivel}` ||
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
            );
          })}

          <div
            className="modal-actions"
            style={{ justifyContent: "flex-end", marginTop: "2rem" }}
          >
            <button type="submit" className="save-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCategoriaModal;
