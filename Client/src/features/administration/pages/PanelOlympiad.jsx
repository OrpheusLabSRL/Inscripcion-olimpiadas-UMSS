import React, { useEffect, useState } from "react";
import {
  getOlimpiadas,
  getAreasCategoriasPorOlimpiada,
} from "../../../api/Administration.api";
import { toast } from "react-toastify";
import PanelOlympiadsTable from "../components/administrationTable/PanelOlympiadsTable";
import RegisterAreaModal from "../components/administrationModal/RegisterAreaModal";
import { FiInfo } from "react-icons/fi";
import "../Styles/ManageDocenteOlympiad.css";

export default function PanelOlympiad() {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [areasCategorias, setAreasCategorias] = useState([]);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);

  useEffect(() => {
    const fetchOlimpiadas = async () => {
      setIsLoading(true);
      try {
        const response = await getOlimpiadas();
        const activas = response.data.filter(
          (olimp) => olimp.estadoOlimpiada === 1
        );
        setOlimpiadas(activas);
      } catch (err) {
        console.error("Error al cargar olimpiadas:", err);
        toast.error("Error al cargar las olimpiadas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOlimpiadas();
  }, []);

  const fetchAreasCategorias = async () => {
    if (!selectedId) {
      setAreasCategorias([]);
      return;
    }

    setIsLoadingAreas(true);
    try {
      const response = await getAreasCategoriasPorOlimpiada(selectedId);
      setAreasCategorias(response.data);
    } catch (err) {
      console.error("Error al cargar áreas y categorías:", err);
      toast.error("Error al cargar las áreas y categorías");
    } finally {
      setIsLoadingAreas(false);
    }
  };

  useEffect(() => {
    fetchAreasCategorias();
  }, [selectedId]);

  const handleOlympiadChange = (e) => {
    setSelectedId(e.target.value);
  };

  const handleAddAreaClick = () => {
    if (!selectedId) {
      toast.warning("Por favor selecciona una olimpiada primero");
      return;
    }
    setIsAreaModalOpen(true);
  };

  return (
    <div className="panel-olymp-container">
      <div className="panel-olymp-form-group">
        <label htmlFor="olimpiada-select" className="panel-olymp-label">
          Selecciona una olimpiada
        </label>
        <select
          id="olimpiada-select"
          className="panel-olymp-select"
          value={selectedId}
          onChange={handleOlympiadChange}
          disabled={isLoading}
        >
          <option value="">-- Seleccionar olimpiada --</option>
          {olimpiadas.map((olimp) => (
            <option key={olimp.idOlimpiada} value={olimp.idOlimpiada}>
              {olimp.version} - {olimp.nombreOlimpiada}
            </option>
          ))}
        </select>
      </div>

      {!selectedId && (
        <div className="panel-olymp-no-selection">
          <FiInfo size={24} />
          No tienes ninguna olimpiada seleccionada. Por favor selecciona una.
        </div>
      )}

      {isLoadingAreas && selectedId && <p>Cargando áreas y categorías...</p>}

      {selectedId && (
        <div className="panel-olymp-content">
          <div className="panel-olymp-header">
            <h3 className="panel-olymp-title">
              Áreas y Categorías -{" "}
              {
                olimpiadas.find((o) => o.idOlimpiada === selectedId)
                  ?.nombreOlimpiada
              }
            </h3>
          </div>

          <PanelOlympiadsTable
            data={areasCategorias}
            selectedVersion={selectedId}
            fechaInicioOlimpiada={
              olimpiadas.find((o) => o.idOlimpiada === parseInt(selectedId))
                ?.fechaInicioOlimpiada
            }
            onRefresh={fetchAreasCategorias}
          />
        </div>
      )}

      <RegisterAreaModal
        isOpen={isAreaModalOpen}
        onClose={() => {
          setIsAreaModalOpen(false);
          fetchAreasCategorias();
        }}
        selectedVersion={parseInt(selectedId)}
      />
    </div>
  );
}
