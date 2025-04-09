import React, { useState, useEffect } from "react";
import "../styles/ModalGeneral.css";
import "../styles/General.css";
import { createArea, getOlimpiadas } from "../../../api/inscription.api";

const AreaModal = ({ isOpen, onClose, onSave, areas = [] }) => {
  const [formData, setFormData] = useState({
    nombreArea: "",
    descripcionArea: "",
    costoArea: "",
    estadoArea: true,
    idOlimpiada: "",
  });

  const [olimpiadas, setOlimpiadas] = useState([]);

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "descripcionArea" && value.length > 200) {
      alert("La descripción solo deben ser 200 caracteres");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (
      !formData.nombreArea.trim() ||
      !formData.descripcionArea.trim() ||
      formData.costoArea === "" ||
      !formData.idOlimpiada
    ) {
      alert("Se deben llenar todos los campos obligatorios");
      return;
    }

    // Validar costo no negativo
    const costo = parseFloat(formData.costoArea);
    if (isNaN(costo) || costo < 0) {
      alert("El costo no puede ser menor a 0 Bs.");
      return;
    }

    // Validar nombre único en la misma olimpiada
    const nombreExiste = areas.some(
      (a) =>
        a.nombreArea.trim().toLowerCase() ===
          formData.nombreArea.trim().toLowerCase() &&
        a.idOlimpiada.toString() === formData.idOlimpiada.toString()
    );
    if (nombreExiste) {
      alert("El nombre del área ya existe en esta olimpiada.");
      return;
    }

    try {
      const payload = {
        ...formData,
        costoArea: costo,
        estadoArea: formData.estadoArea ? 1 : 0,
        idOlimpiada: parseInt(formData.idOlimpiada),
      };

      console.log("Registrando área:", payload);
      await createArea(payload);
      alert("Área registrada exitosamente.");
      onClose();
      onSave && onSave();
    } catch (err) {
      console.error("Error al crear el área:", err);
      alert("Hubo un error al guardar el área.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={onClose}>
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
              required
            />
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
              maxLength={200}
              required
            />
            <small>{formData.descripcionArea.length}/200</small>
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
              required
            />
          </div>

          {/* Desplegable de versiones de olimpiada */}
          <div className="form-group">
            <label>
              Versión de Olimpiada <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="idOlimpiada"
              value={formData.idOlimpiada}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una versión</option>
              {olimpiadas.map((olimp) => (
                <option key={olimp.idOlimpiada} value={olimp.idOlimpiada}>
                  {`${olimp.version} - ${olimp.nombreOlimpiada}`}
                </option>
              ))}
            </select>
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
            <button type="button" className="cancel-button" onClick={onClose}>
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
