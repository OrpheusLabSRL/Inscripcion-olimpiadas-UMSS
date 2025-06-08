import React, { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import MultiSelectDropdown from "../../components/MultiSelectDropdown.jsx";
import "../../styles/Dropdown.css";
import "../../styles/ModalGeneral.css";

import {
  getOlimpiadas,
  getAreas,
  getCategoriaGrado,
  getAreasCategoriasPorOlimpiada,
  asignarAreasYCategorias,
  deleteAreaCategoriaByOlimpiadaAndArea,
} from "../../../../api/Administration.api";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RegisterCategoriaModal = ({
  isOpen,
  onClose,
  onSuccess,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;
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
    setIsSubmitting(true);

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
      setIsSubmitting(false);
      await MySwal.fire({
        icon: "error",
        title: "Errores en el formulario",
        text: "Por favor corrige los errores antes de guardar.",
        customClass: { container: "swal2Container" },
      });
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
      customClass: { container: "swal2Container" },
    });

    if (!confirmacion.isConfirmed) {
      setIsSubmitting(false);
      return;
    }

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

      await MySwal.fire({
        icon: "success",
        title: "¡Categoría registrada!",
        text: "La categoría se registró exitosamente.",
        timer: 2000,
        showConfirmButton: false,
        customClass: { container: "swal2Container" },
      });

      handleReset();

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar los datos.",
        customClass: { container: "swal2Container" },
      });
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting}
        >
          ✖
        </button>

        <form onSubmit={handleSubmit} className="adminModalForm">
          <h3 className="adminModalTitle">Categorías de la Olimpiada</h3>

          {selectedAreas.map((areaId) => {
            const area = areas.find((a) => a.idArea === areaId);

            const categoriasOptions = categorias.map((c) => ({
              value: c.idCategoria,
              label: `${c.nombreCategoria}${
                c.grados?.length > 0
                  ? ` (${c.grados
                      .map((g) => `${g.numeroGrado}° ${g.nivel}`)
                      .join(", ")})`
                  : ""
              }`,
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
                  Área: <strong> {area?.nombreArea} </strong>
                </label>

                <label className="adminFormLabel">
                  Costo por categoría (Bs):
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={costoPorArea[areaId] || ""}
                    onChange={(e) =>
                      setCostoPorArea((prev) => ({
                        ...prev,
                        [areaId]: e.target.value,
                      }))
                    }
                    className={`adminFormInput ${
                      errors[`costo-${areaId}`] ? "adminInputError" : ""
                    }`}
                    style={{
                      marginLeft: "1rem",
                      padding: "0.3rem",
                      width: "120px",
                    }}
                    disabled={isSubmitting}
                  />
                </label>
                {errors[`costo-${areaId}`] && (
                  <p className="adminErrorMessage">
                    <FiAlertCircle /> {errors[`costo-${areaId}`]}
                  </p>
                )}

                <div
                  className={`adminDropdownWrapper large ${
                    errors[`categorias-${areaId}`] ? "adminInputError" : ""
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
                    disabled={isSubmitting}
                    error={!!errors[`categorias-${areaId}`]}
                    errorMessage={errors[`categorias-${areaId}`]}
                  />
                </div>

                {categoriasSeleccionadas.length > 0 && (
                  <div className="selectedCategoriesContainer">
                    <p className="selectedCategoriesTitle">
                      Categorías seleccionadas:
                    </p>
                    <ul className="selectedCategoriesList">
                      {categoriasSeleccionadas.map((cat) => (
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
            );
          })}

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
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCategoriaModal;
