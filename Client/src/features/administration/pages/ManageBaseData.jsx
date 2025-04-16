import React, { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown.jsx";
import MultiSelectDropdown from "../components/MultiSelectDropdown.jsx";
import "../Styles/General.css";

import {
  getOlimpiadas,
  getAreas,
  getCategorias,
  asignarAreasYCategorias,
} from "../../../api/Administration.api";

const ManageBaseData = () => {
  const [version, setVersion] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState({});
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const olimpiadasData = await getOlimpiadas();
        const areasData = await getAreas();
        const categoriasData = await getCategorias();

        setOlimpiadas(olimpiadasData.data || []);
        setAreas(areasData || []);
        setCategorias(categoriasData || []);
      } catch (error) {
        console.error("Error al cargar datos base:", error);
      }
    };

    fetchData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!version) {
      newErrors.version = "Debe seleccionar una versión";
    }

    if (selectedAreas.length === 0) {
      newErrors.areas = "Debe seleccionar al menos una área";
    }

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

    // 🔄 Generar combinaciones planas
    const combinaciones = [];

    selectedAreas.forEach((idArea) => {
      const categorias = selectedCategorias[idArea] || [];
      categorias.forEach((idCategoria) => {
        combinaciones.push({
          idOlimpiada: parseInt(version),
          idArea,
          idCategoria,
        });
      });
    });

    console.log("📦 Combinaciones a enviar:", combinaciones);

    try {
      await asignarAreasYCategorias(combinaciones);
      alert("¡Configuración guardada exitosamente!");
      // Reset de estado
      setVersion("");
      setSelectedAreas([]);
      setSelectedCategorias({});
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Ocurrió un error al guardar los datos.");
    }
  };

  return (
    <div className="page-content">
      <div style={{ marginBottom: "1rem" }}>
        <button className="back-button" onClick={() => window.history.back()}>
          ←
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h3 className="section-title">
            Seleccionar la Versión de la Olimpiada
          </h3>

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

          <p className="note">
            Nota: Si desea añadir o modificar una nueva área o categoría,
            contactarse con un administrador
          </p>

          <h3 className="section-title">Áreas de la Olimpiada</h3>

          <MultiSelectDropdown
            label="Seleccione las Áreas"
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

          <h3 className="section-title">Categorías por Área</h3>

          {selectedAreas.map((areaId) => {
            const area = areas.find((a) => a.idArea === areaId);
            const categoriasOptions = categorias.map((c) => ({
              value: c.idCategoria,
              label: c.nombreCategoria,
            }));

            return (
              <div key={areaId} className="field-group inline">
                <div className="area-dropdown">
                  <label className="field-label required">
                    {area?.nombreArea}
                  </label>
                </div>
                <div className="categoria-dropdown">
                  <MultiSelectDropdown
                    label=""
                    name={`categorias-${areaId}`}
                    placeholder="Seleccione Categorías"
                    options={categoriasOptions}
                    selectedValues={selectedCategorias[areaId] || []}
                    onChange={(values) => handleCategoriaChange(areaId, values)}
                    error={!!errors[`categorias-${areaId}`]}
                    errorMessage={errors[`categorias-${areaId}`]}
                  />
                </div>
              </div>
            );
          })}

          <div className="btn-container align-right">
            <button type="submit" className="btn-registrar">
              FINALIZAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageBaseData;
