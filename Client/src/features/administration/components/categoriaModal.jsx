import React, { useState, useEffect } from "react";
import {
  getAreas,
  getGrados,
  createCategoria,
} from "../../../api/inscription.api";
import "../styles/ModalGeneral.css";

const ModalAgregarCategoria = ({ isOpen, onClose, onSubmit }) => {
  const initialForm = {
    nombreCategoria: "",
    area: "",
    grados: [], // ✅ array
    estado: true,
  };

  const [formData, setFormData] = useState(initialForm);
  const [areas, setAreas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [errors, setErrors] = useState({});
  const [mostrarGrados, setMostrarGrados] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const areasFromAPI = await getAreas();
        const gradosFromAPI = await getGrados();
        setAreas(areasFromAPI);
        setGrados(gradosFromAPI);
      } catch (err) {
        console.error("Error al obtener áreas o grados:", err);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "grados") {
      setFormData((prev) => {
        const updatedGrados = checked
          ? [...prev.grados, value]
          : prev.grados.filter((g) => g !== value);
        return { ...prev, grados: updatedGrados };
      });
    } else {
      const newValue = type === "checkbox" ? checked : value;
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.nombreCategoria.trim()) {
      newErrors.nombreCategoria = ["Este campo es requerido."];
    }

    if (!formData.area) {
      newErrors.idArea = ["Debe seleccionar un área."];
    }

    if (formData.grados.length === 0) {
      newErrors.grados = ["Debe seleccionar al menos un grado."];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const baseData = {
      nombreCategoria: formData.nombreCategoria.trim(),
      estado: formData.estado,
      idArea: parseInt(formData.area),
    };

    let successCount = 0;
    let errorCount = 0;
    let errorMessages = [];

    try {
      for (const idGrado of formData.grados) {
        const data = {
          ...baseData,
          idGrado: parseInt(idGrado),
        };

        try {
          await createCategoria(data);
          successCount++;
        } catch (error) {
          errorCount++;
          const errMsg =
            error.response?.data?.errors?.nombreCategoria?.[0] ||
            "Error desconocido.";
          errorMessages.push(`Grado ID ${idGrado}: ${errMsg}`);
        }
      }

      if (successCount > 0) {
        alert("Categorías registradas exitosamente.");
        resetForm();
        onSubmit();
        onClose();
      }

      if (errorCount > 0) {
        alert(`Ocurrieron ${errorCount} errores:\n` + errorMessages.join("\n"));
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Ocurrió un error al registrar las categorías.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2 className="modal-title">Agregar categoría</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label>
              Nombre de la categoría <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="nombreCategoria"
              value={formData.nombreCategoria}
              onChange={handleChange}
              className={errors.nombreCategoria ? "input-error" : ""}
            />
            {errors?.nombreCategoria && (
              <p className="error-message">{errors.nombreCategoria[0]}</p>
            )}
          </div>

          {/* Área */}
          <div className="form-group">
            <label>
              Área <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={errors.idArea ? "input-error" : ""}
            >
              <option value="">Selecciona un área</option>
              {areas.map((area) => (
                <option key={area.idArea} value={area.idArea}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
            {errors?.idArea && (
              <p className="error-message">{errors.idArea[0]}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              Grados <span style={{ color: "red" }}>*</span>
            </label>

            <button
              type="button"
              className="toggle-button"
              onClick={() => setMostrarGrados(!mostrarGrados)}
            >
              {mostrarGrados ? "Ocultar grados" : "Mostrar grados"}
            </button>

            {mostrarGrados && (
              <ul className="checkbox-list">
                {grados.map((grado) => (
                  <li key={grado.idGrado} className="checkbox-list-item">
                    <label>
                      <input
                        type="checkbox"
                        name="grados"
                        value={grado.idGrado}
                        checked={formData.grados.includes(
                          String(grado.idGrado)
                        )}
                        onChange={handleChange}
                      />
                      {grado.numeroGrado}° de {grado.nivel}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {errors?.grados && (
              <p className="error-message">{errors.grados[0]}</p>
            )}
          </div>

          {/* Estado */}
          <div className="checkbox-row">
            <label htmlFor="estado">
              <span>Activo</span>
              <input
                id="estado"
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Botones */}
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

export default ModalAgregarCategoria;
