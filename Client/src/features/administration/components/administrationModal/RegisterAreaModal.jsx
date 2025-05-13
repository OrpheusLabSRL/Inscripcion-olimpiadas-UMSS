import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSave,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../Styles/ModalGeneral.css";
import "../../Styles/Dropdown.css";
import {
  getOlimpiadas,
  getAreas,
  getCategoriaGrado,
  getAreasCategoriasPorOlimpiada,
  asignarAreasYCategorias,
} from "../../../../api/Administration.api";
import { toast } from "react-toastify";

const RegisterAreaModal = ({ isOpen, onClose, selectedVersion, onSuccess }) => {
  const [version, setVersion] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [costoArea, setCostoArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [initialState, setInitialState] = useState({
    areas: [],
    categorias: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    if (isSubmitting) return;
    setVersion("");
    setSelectedArea(null);
    setSelectedCategorias([]);
    setCostoArea("");
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [_, areasData, categoriaGradoData] = await Promise.all([
          getOlimpiadas(),
          getAreas(),
          getCategoriaGrado(),
        ]);

        if (!isMounted) return;

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
      } catch (error) {
        if (isMounted) {
          console.error("Error cargando datos base:", error);
          toast.error("Error al cargar los datos iniciales");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedVersion]);

  useEffect(() => {
    if (!isOpen || !version) return;

    let isMounted = true;

    const cargarAsignacionesPrevias = async () => {
      setIsLoading(true);
      try {
        const response = await getAreasCategoriasPorOlimpiada(version);
        const data = Array.isArray(response) ? response : response.data || [];

        if (!isMounted) return;

        const areasAsignadas = data.map((area) => area.idArea);
        const categoriasAsignadas = {};

        data.forEach((area) => {
          categoriasAsignadas[area.idArea] = area.categorias.map(
            (cat) => cat.idCategoria
          );
        });

        setInitialState({
          areas: areasAsignadas,
          categorias: categoriasAsignadas,
        });
      } catch (error) {
        if (isMounted) {
          console.error("Error cargando áreas y categorías existentes:", error);
          toast.error("Error al cargar asignaciones previas");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    cargarAsignacionesPrevias();

    return () => {
      isMounted = false;
    };
  }, [isOpen, version]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!version) newErrors.version = "Versión requerida";
    if (!selectedArea) newErrors.area = "Seleccione un área";
    if (selectedCategorias.length === 0)
      newErrors.categorias = "Seleccione al menos una categoría";
    if (!costoArea || isNaN(costoArea) || Number(costoArea) < 0)
      newErrors.costo = "Ingrese un costo válido";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const areaNombre = areas.find(
        (a) => a.idArea == selectedArea
      )?.nombreArea;
      const confirmacion = window.confirm(
        `¿Agregar el área ${areaNombre} con ${selectedCategorias.length} categorías?`
      );
      if (!confirmacion) {
        setIsSubmitting(false);
        return;
      }

      // Filtrar categorías no asignadas
      const categoriasExistentes = initialState.categorias[selectedArea] || [];
      const nuevasCategorias = selectedCategorias.filter(
        (catId) => !categoriasExistentes.includes(parseInt(catId))
      );

      if (nuevasCategorias.length === 0) {
        alert(
          "Todas las categorías seleccionadas ya están asignadas a esta área"
        );
        setIsSubmitting(false);
        return;
      }

      const combinaciones = nuevasCategorias.map((idCategoria) => ({
        idOlimpiada: parseInt(version),
        idArea: parseInt(selectedArea),
        idCategoria: parseInt(idCategoria),
        costo: parseFloat(costoArea),
      }));

      await asignarAreasYCategorias(combinaciones);

      // Mensaje de éxito con alert
      alert(
        `✅ Asignación exitosa!\n\n` +
          `Se agregaron ${nuevasCategorias.length} categoría(s) al área ${areaNombre}\n` +
          `Versión: ${selectedVersion}`
      );

      handleReset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert(
        "❌ Error al guardar\n\n" +
          (error.response?.data?.message ||
            error.message ||
            "Error en el servidor")
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  const areasNoAsignadas = areas.filter(
    (area) => !initialState.areas.includes(area.idArea)
  );
  const noHayMasAreas = areas.length > 0 && areasNoAsignadas.length === 0;
  const areaSeleccionada = areas.find((a) => a.idArea == selectedArea);

  return (
    <div className="modal-overlay" onClick={handleReset}>
      <div
        className="modal-content"
        style={{ maxWidth: "850px", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Agregar Área y Categorías</h3>
          <button
            type="button"
            className="close-button"
            onClick={handleReset}
            aria-label="Cerrar modal"
            disabled={isSubmitting}
          >
            <FiX />
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-section">
              <h4 className="section-subtitle">Olimpiada seleccionada</h4>
              <div className="version-display">
                Versión: <strong>{selectedVersion}</strong>
              </div>
            </div>

            <div className="form-section">
              <h4 className="section-subtitle">Selección de Área</h4>

              {noHayMasAreas ? (
                <div className="alert-message">
                  <FiAlertCircle className="alert-icon" />
                  <span>Todas las áreas disponibles ya están asignadas.</span>
                </div>
              ) : (
                <>
                  <div
                    className={`form-group ${errors.area ? "has-error" : ""}`}
                  >
                    <label className="form-label">Área</label>
                    <select
                      className="form-select"
                      value={selectedArea || ""}
                      onChange={(e) => {
                        setSelectedArea(e.target.value);
                        setErrors((prev) => ({ ...prev, area: "" }));
                        setSelectedCategorias([]);
                      }}
                      disabled={noHayMasAreas || isSubmitting}
                    >
                      <option value="">-- Seleccione un área --</option>
                      {areasNoAsignadas.map((a) => (
                        <option key={a.idArea} value={a.idArea}>
                          {a.nombreArea}
                        </option>
                      ))}
                    </select>
                    {errors.area && (
                      <p className="error-message">
                        <FiAlertCircle /> {errors.area}
                      </p>
                    )}
                  </div>

                  {selectedArea && (
                    <div className="area-description">
                      <p>
                        {areaSeleccionada?.descripcionArea ||
                          "No hay descripción disponible"}
                      </p>
                    </div>
                  )}

                  <div
                    className={`form-group ${errors.costo ? "has-error" : ""}`}
                  >
                    <label className="form-label">Costo del Área (Bs)</label>
                    <div className="input-with-icon">
                      <FiDollarSign className="input-icon" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={costoArea}
                        onChange={(e) => {
                          setCostoArea(e.target.value);
                          setErrors((prev) => ({ ...prev, costo: "" }));
                        }}
                        placeholder="Ej: 50.00"
                        className="form-input"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.costo && (
                      <p className="error-message">
                        <FiAlertCircle /> {errors.costo}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {selectedArea && (
              <div className="form-section">
                <h4 className="section-subtitle">Selección de Categorías</h4>
                <div
                  className={`form-group ${
                    errors.categorias ? "has-error" : ""
                  }`}
                >
                  <MultiSelectDropdown
                    label=""
                    name="categorias"
                    placeholder="Seleccione las categorías..."
                    options={categorias.map((c) => ({
                      value: c.idCategoria,
                      label: `${c.nombreCategoria}${
                        c.grados && c.grados.length > 0
                          ? ` (${c.grados
                              .map((g) => `${g.numeroGrado}° ${g.nivel}`)
                              .join(", ")})`
                          : ""
                      }`,
                    }))}
                    selectedValues={selectedCategorias}
                    onChange={(values) => {
                      setSelectedCategorias(values);
                      setErrors((prev) => ({ ...prev, categorias: "" }));
                    }}
                    disabled={isSubmitting}
                  />
                  {errors.categorias && (
                    <p className="error-message">
                      <FiAlertCircle /> {errors.categorias}
                    </p>
                  )}

                  {selectedCategorias.length > 0 && (
                    <div className="selected-categories-container">
                      <h5 className="selected-categories-title">
                        Categorías seleccionadas:
                      </h5>
                      <ul className="selected-categories-list">
                        {categorias
                          .filter((c) =>
                            selectedCategorias.includes(c.idCategoria)
                          )
                          .map((categoria) => (
                            <li
                              key={categoria.idCategoria}
                              className="selected-category-item"
                            >
                              <div className="category-name">
                                {categoria.nombreCategoria}
                              </div>
                              {categoria.grados &&
                                categoria.grados.length > 0 && (
                                  <div className="grade-list">
                                    {categoria.grados
                                      .map(
                                        (g) => `${g.numeroGrado}° ${g.nivel}`
                                      )
                                      .join(", ")}
                                  </div>
                                )}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={
                  noHayMasAreas ||
                  isSubmitting ||
                  selectedCategorias.length === 0
                }
              >
                {isSubmitting ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <FiSave /> Agregar
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterAreaModal;
