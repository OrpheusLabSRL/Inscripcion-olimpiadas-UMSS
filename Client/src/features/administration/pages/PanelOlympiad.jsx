import React, { useEffect, useState } from "react";
import "../Styles/ManageDocenteOlympiad.css";
import {
  getOlimpiadas,
  getAreasCategoriasPorOlimpiada,
} from "../../../api/Administration.api";
import PanelOlympiadsTable from "../components/administrationTable/PanelOlympiadsTable";

export default function PanelOlympiad() {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [areasCategorias, setAreasCategorias] = useState([]);

  useEffect(() => {
    getOlimpiadas()
      .then((res) => {
        const activas = res.data.filter((olimp) => olimp.estadoOlimpiada === 1);
        setOlimpiadas(activas);
      })
      .catch((err) => console.error("Error al cargar olimpiadas:", err));
  }, []);

  useEffect(() => {
    if (selectedId) {
      getAreasCategoriasPorOlimpiada(selectedId)
        .then((res) => {
          setAreasCategorias(res.data);
        })
        .catch((err) =>
          console.error("Error al cargar áreas y categorías:", err)
        );
    } else {
      setAreasCategorias([]);
    }
  }, [selectedId]);

  return (
    <div className="manage-docente-container">
      <h2>Gestionar Olimpiada</h2>

      <div className="selector-container">
        <label htmlFor="olimpiada-select" className="selector-label">
          Selecciona una olimpiada:
        </label>
        <select
          id="olimpiada-select"
          className="selector-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {olimpiadas.map((olimp) => (
            <option key={olimp.idOlimpiada} value={olimp.idOlimpiada}>
              {olimp.version} - {olimp.nombreOlimpiada}
            </option>
          ))}
        </select>
      </div>

      {selectedId && areasCategorias.length > 0 && (
        <PanelOlympiadsTable
          data={areasCategorias}
          selectedVersion={selectedId}
        />
      )}
    </div>
  );
}
