import React, { useState, useEffect, useReducer } from "react";
import { FiX, FiSave, FiDollarSign, FiAlertCircle } from "react-icons/fi";
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
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [version, setVersion] = useState("");
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [costoArea, setCostoArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({
    area: "",
    costo: "",
    categorias: "",
  });
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
    setErrors({
      area: "",
      costo: "",
      categorias: "",
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [olimpiadasResponse, areasData, categoriaGradoData] =
          await Promise.all([getOlimpiadas(), getAreas(), getCategoriaGrado()]);

        if (!isMounted) return;

        const categoriaMap = new Map();
        categoriaGradoData.forEach(({ categoria, grado }) => {
          if (!categoriaMap.has(categoria.idCategoria)) {
            categoriaMap.set(categoria.idCategoria, {
              idCategoria: categoria.idCategoria,
              nombreCategoria: categoria.nombreCategoria,
              grados: [],
            });
          }
          if (grado) categoriaMap.get(categoria.idCategoria).grados.push(grado);
        });

        setOlimpiadas(olimpiadasResponse.data || []);
        setAreas(areasData || []);
        setCategorias(Array.from(categoriaMap.values()));
        setVersion(selectedVersion);
      } catch (error) {
        if (isMounted) toast.error("Error al cargar los datos iniciales");
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

        const areasAsignadas = data.map((a) => a.idArea);
        const categoriasAsignadas = {};
        data.forEach((a) => {
          categoriasAsignadas[a.idArea] = a.categorias.map(
            (c) => c.idCategoria
          );
        });

        setInitialState({
          areas: areasAsignadas,
          categorias: categoriasAsignadas,
        });
      } catch (error) {
        if (isMounted) toast.error("Error al cargar asignaciones previas");
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

    setErrors({ area: "", costo: "", categorias: "" });

    const newErrors = {};
    let hasErrors = false;

    if (!selectedArea) {
      newErrors.area = "Selecciona un área";
      hasErrors = true;
    }

    if (!costoArea || isNaN(costoArea) || Number(costoArea) <= 0) {
      newErrors.costo = "El precio debe ser mayor a 0 Bs";
      hasErrors = true;
    }

    if (selectedCategorias.length === 0) {
      newErrors.categorias = "Selecciona al menos una categoría";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      forceUpdate();
      setTimeout(() => {
        const firstError = document.querySelector(".input-error, .has-error");
        if (firstError)
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setIsSubmitting(true);

    try {
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

      const confirmacion = window.confirm(
        "¿Está seguro de guardar esta configuración?"
      );
      if (!confirmacion) {
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

      alert("¡Configuración realizada exitosamente!");
      setTimeout(() => {
        handleReset();
        if (onSuccess) onSuccess();
      }, 100);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Error al guardar la configuración.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const olimpiadaSeleccionada = olimpiadas.find(
    (o) => o.idOlimpiada === selectedVersion
  );
  const versionTexto = olimpiadaSeleccionada?.version || "—";

  const areasNoAsignadas = areas.filter(
    (area) => !initialState.areas.includes(area.idArea)
  );
  const areaSeleccionada = areas.find((a) => a.idArea == selectedArea);

  if (!isOpen) return null;

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
                Versión: <strong>{versionTexto}</strong>
              </div>
            </div>

            <div className="form-section">
              <h4 className="section-subtitle">Selección de Área</h4>
              <div className={`form-group ${errors.area ? "has-error" : ""}`}>
                <label className="form-label">
                  Área <span className="required-field">*</span>
                </label>
                <select
                  className={`form-select ${errors.area ? "input-error" : ""}`}
                  value={selectedArea || ""}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    setSelectedCategorias([]);
                    setErrors((prev) => ({ ...prev, area: "" }));
                  }}
                  disabled={areasNoAsignadas.length === 0 || isSubmitting}
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

              <div className={`form-group ${errors.costo ? "has-error" : ""}`}>
                <label className="form-label">
                  Costo del Área (Bs) <span className="required-field">*</span>
                </label>
                <div
                  className={`input-with-icon ${
                    errors.costo ? "input-error" : ""
                  }`}
                >
                  <FiDollarSign className="input-icon" />
                  <input
                    type="number"
                    step="0.5"
                    value={costoArea}
                    onChange={(e) => {
                      setCostoArea(e.target.value);
                      setErrors((prev) => ({ ...prev, costo: "" }));
                    }}
                    placeholder="Ej: 50.00"
                    className={`form-input ${
                      errors.costo ? "input-error" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.costo && (
                  <p className="error-message">
                    <FiAlertCircle /> {errors.costo}
                  </p>
                )}
              </div>
            </div>

            {selectedArea && (
              <div
                className={`form-section ${
                  errors.categorias ? "has-error" : ""
                }`}
              >
                <h4 className="section-subtitle">
                  Selección de Categorías{" "}
                  <span className="required-field">*</span>
                </h4>
                <div className="form-group">
                  <MultiSelectDropdown
                    name="categorias"
                    placeholder="Seleccione las categorías..."
                    options={categorias.map((c) => ({
                      value: c.idCategoria,
                      label: `${c.nombreCategoria}${
                        c.grados?.length
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
                    error={!!errors.categorias}
                    errorMessage={errors.categorias}
                  />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Guardando..."
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
