import React, { useState, useEffect } from "react";
import "../styles/ModalGeneral.css";
import "../styles/General.css";
import {
  createArea,
  getOlimpiadas,
  getAreas,
} from "../../../api/inscription.api";

const AreaModal = ({ isOpen, onClose, onSave }) => {
  const initialState = {
    nombreArea: "",
    descripcionArea: "",
    costoArea: "",
    estadoArea: true,
    idOlimpiada: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [areas, setAreas] = useState([]); // ahora lo obtenemos aquí

  // Cargar olimpiadas
  useEffect(() => {
    const fetchOlimpiadas = async () => {
      try {
        const data = await getOlimpiadas();
        setOlimpiadas(data.data);
      } catch (error) {
        console.error("Error al cargar olimpiadas:", error);
        alert("No se pudieron cargar las versiones de olimpiadas.");
      }
    };
    fetchOlimpiadas();
  }, []);

  // Cargar áreas solo cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const fetchAreas = async () => {
        try {
          const data = await getAreas();
          setAreas(data); // ✅ arreglo directo desde la API
        } catch (error) {
          console.error("Error al obtener áreas:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAreas();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    const newErrors = { ...errors };

    switch (name) {
      case "nombreArea":
        if (!newValue.trim()) {
          newErrors.nombreArea = "Este campo es requerido";
        } else if (!formData.idOlimpiada) {
          newErrors.nombreArea =
            "Debe seleccionar primero una versión de olimpiada";
        } else {
          const nombreExiste =
            Array.isArray(areas) &&
            areas.some(
              (a) =>
                a.nombreArea.trim().toLowerCase() ===
                  newValue.trim().toLowerCase() &&
                a.idOlimpiada.toString() === formData.idOlimpiada.toString()
            );
          if (nombreExiste) {
            newErrors.nombreArea =
              "Ya existe un área con ese nombre en esta olimpiada";
          } else {
            delete newErrors.nombreArea;
          }
        }
        break;

      case "descripcionArea":
        if (!newValue.trim()) {
          newErrors.descripcionArea = "Este campo es requerido";
        } else {
          delete newErrors.descripcionArea;
        }
        break;

      case "costoArea":
        if (newValue === "") {
          newErrors.costoArea = "Este campo es requerido";
        } else if (isNaN(parseFloat(newValue)) || parseFloat(newValue) < 0) {
          newErrors.costoArea = "El costo debe ser un número mayor o igual a 0";
        } else {
          delete newErrors.costoArea;
        }
        break;

      case "idOlimpiada":
        if (!newValue) {
          newErrors.idOlimpiada = "Debe seleccionar una versión de olimpiada";
        } else {
          // Validar nombre otra vez por si ya estaba escrito
          if (formData.nombreArea.trim()) {
            const nombreExiste =
              Array.isArray(areas) &&
              areas.some(
                (a) =>
                  a.nombreArea.trim().toLowerCase() ===
                    formData.nombreArea.trim().toLowerCase() &&
                  a.idOlimpiada.toString() === newValue.toString()
              );
            if (nombreExiste) {
              newErrors.nombreArea =
                "Ya existe un área con ese nombre en esta olimpiada";
            } else {
              delete newErrors.nombreArea;
            }
          }
          delete newErrors.idOlimpiada;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreArea.trim()) {
      nuevosErrores.nombreArea = "Este campo es requerido";
    } else if (!formData.idOlimpiada) {
      nuevosErrores.nombreArea =
        "Debe seleccionar una versión de olimpiada primero";
    } else {
      const nombreExiste =
        Array.isArray(areas) &&
        areas.some(
          (a) =>
            a.nombreArea.trim().toLowerCase() ===
              formData.nombreArea.trim().toLowerCase() &&
            a.idOlimpiada.toString() === formData.idOlimpiada.toString()
        );
      console.log("gpa" + areas);
      if (nombreExiste) {
        nuevosErrores.nombreArea =
          "Ya existe un área con ese nombre en esta olimpiada";
      }
    }

    if (!formData.descripcionArea.trim()) {
      nuevosErrores.descripcionArea = "Este campo es requerido";
    }

    if (formData.costoArea === "") {
      nuevosErrores.costoArea = "Este campo es requerido";
    } else if (
      isNaN(parseFloat(formData.costoArea)) ||
      parseFloat(formData.costoArea) < 0
    ) {
      nuevosErrores.costoArea = "El costo debe ser un número mayor o igual a 0";
    }

    if (!formData.idOlimpiada) {
      nuevosErrores.idOlimpiada = "Debe seleccionar una versión de olimpiada";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const payload = {
        ...formData,
        costoArea: parseFloat(formData.costoArea),
        estadoArea: formData.estadoArea ? 1 : 0,
        idOlimpiada: parseInt(formData.idOlimpiada),
      };

      await createArea(payload);
      alert("Área registrada exitosamente.");
      resetForm();
      onClose();
      onSave && onSave();
    } catch (err) {
      console.error("Error al crear el área:", err);
      alert("Hubo un error al guardar el área.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={handleClose}>
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="modal-title">Agregar área</h2>

          <div className="form-group">
            <label>
              Nombre <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="nombreArea"
              placeholder="Ingresa el nombre del área"
              value={formData.nombreArea}
              onChange={handleChange}
              className={errors.nombreArea ? "input-error" : ""}
            />
            {errors.nombreArea && (
              <p className="error-message">{errors.nombreArea}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              Descripción <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="descripcionArea"
              placeholder="Describe los detalles del área"
              value={formData.descripcionArea}
              onChange={handleChange}
              maxLength={300}
              className={errors.descripcionArea ? "input-error" : ""}
            />
            <small>{formData.descripcionArea.length}/300</small>
            {errors.descripcionArea && (
              <p className="error-message">{errors.descripcionArea}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              Costo (Bs) <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              name="costoArea"
              placeholder="Ingresa el costo del área"
              value={formData.costoArea}
              onChange={handleChange}
              className={errors.costoArea ? "input-error" : ""}
            />
            {errors.costoArea && (
              <p className="error-message">{errors.costoArea}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              Versión de Olimpiada <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="idOlimpiada"
              value={formData.idOlimpiada}
              onChange={handleChange}
              className={errors.idOlimpiada ? "input-error" : ""}
            >
              <option value="">Selecciona una versión</option>
              {olimpiadas.map((olimp) => (
                <option key={olimp.idOlimpiada} value={olimp.idOlimpiada}>
                  {`${olimp.version} - ${olimp.nombreOlimpiada}`}
                </option>
              ))}
            </select>
            {errors.idOlimpiada && (
              <p className="error-message">{errors.idOlimpiada}</p>
            )}
          </div>

          <div className="form-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              Activo
              <input
                type="checkbox"
                name="estadoArea"
                checked={formData.estadoArea}
                onChange={handleChange}
                style={{ width: "18px", height: "18px" }}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AreaModal;
