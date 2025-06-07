import React, { useState, useEffect, useReducer } from "react";
import { FiX, FiSave, FiDollarSign, FiAlertCircle } from "react-icons/fi";
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
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
        const firstError = document.querySelector(
          ".adminInputError, .adminHasError"
        );
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
        await MySwal.fire({
          icon: "warning",
          title: "Sin nuevas categorías",
          text: "Todas las categorías seleccionadas ya están asignadas a esta área",
          customClass: {
            container: "swal2-container",
          },
        });
        setIsSubmitting(false);
        return;
      }

      const confirmacion = await MySwal.fire({
        title: "¿Está seguro?",
        text: "¿Deseas guardar esta configuración?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        customClass: {
          container: "swal2-container",
        },
      });

      if (!confirmacion.isConfirmed) {
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

      await MySwal.fire({
        icon: "success",
        title: "¡Configuración guardada!",
        text: "La configuración se ha guardado correctamente.",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          container: "swal2-container",
        },
      });

      setTimeout(() => {
        handleReset();
        if (onSuccess) onSuccess();
      }, 100);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar la configuración.",
        customClass: {
          container: "swal2-container",
        },
      });
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
    <div className="adminModalOverlay" onClick={handleReset}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "850px", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="adminModalCloseBtn"
          onClick={handleReset}
          aria-label="Cerrar modal"
          disabled={isSubmitting}
        >
          <FiX />
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Agregar Área y Categorías</h3>
        </div>

        {isLoading ? (
          <div className="adminLoadingContainer">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="adminModalForm">
            <div className="adminFormSection">
              <h4 className="adminSectionSubtitle">Olimpiada seleccionada</h4>
              <div className="adminVersionDisplay">
                Versión: <strong>{versionTexto}</strong>
              </div>
            </div>

            <div className="adminFormSection">
              <h4 className="adminSectionSubtitle">Selección de Área</h4>
              <div
                className={`adminFormGroup ${
                  errors.area ? "adminHasError" : ""
                }`}
              >
                <label className="adminFormLabel">
                  Área <span className="adminRequiredField">*</span>
                </label>
                <select
                  className={`adminFormSelect ${
                    errors.area ? "adminInputError" : ""
                  }`}
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

                {areasNoAsignadas.length === 0 && !isSubmitting && (
                  <p
                    style={{
                      color: "#9ca3af",
                      marginTop: "0.25rem",
                      fontStyle: "italic",
                    }}
                  >
                    Todas las áreas ya están asignadas, no quedan más
                    disponibles.
                  </p>
                )}

                {errors.area && (
                  <p className="adminErrorMessage">
                    <FiAlertCircle /> {errors.area}
                  </p>
                )}
              </div>

              <div
                className={`adminFormGroup ${
                  errors.costo ? "adminHasError" : ""
                }`}
              >
                <label className="adminFormLabel">
                  Costo del Área (Bs){" "}
                  <span className="adminRequiredField">*</span>
                </label>
                <div
                  className={`adminInputWithIcon ${
                    errors.costo ? "adminInputError" : ""
                  }`}
                >
                  <FiDollarSign className="adminInputIcon" />
                  <input
                    type="number"
                    step="0.5"
                    value={costoArea}
                    onChange={(e) => {
                      setCostoArea(e.target.value);
                      setErrors((prev) => ({ ...prev, costo: "" }));
                    }}
                    placeholder="Ej: 50.00"
                    className={`adminFormInput ${
                      errors.costo ? "adminInputError" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.costo && (
                  <p className="adminErrorMessage">
                    <FiAlertCircle /> {errors.costo}
                  </p>
                )}
              </div>
            </div>

            {selectedArea && (
              <div
                className={`adminFormSection ${
                  errors.categorias ? "adminHasError" : ""
                }`}
              >
                <h4 className="adminSectionSubtitle">
                  Selección de Categorías{" "}
                  <span className="adminRequiredField">*</span>
                </h4>
                <div className="adminFormGroup">
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
                  {selectedCategorias.length > 0 && (
                    <div className="selectedCategoriesContainer">
                      <p className="selectedCategoriesTitle">
                        Categorías seleccionadas:
                      </p>
                      <ul className="selectedCategoriesList">
                        {categorias
                          .filter((c) =>
                            selectedCategorias.includes(c.idCategoria)
                          )
                          .map((cat) => (
                            <li
                              key={cat.idCategoria}
                              className="selectedCategoryItem"
                            >
                              <strong>{cat.nombreCategoria}</strong>
                              {cat.grados?.length > 0 && (
                                <div className="gradeList">
                                  {cat.grados
                                    .map((g) => `${g.numeroGrado}° ${g.nivel}`)
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

            <div className="adminModalActions">
              <button
                type="button"
                className="adminModalBtnCancel"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="adminModalBtnSave"
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
