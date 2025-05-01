import React, { useEffect, useState } from "react";
import { getOlimpiadas } from "../../../../api/inscription.api";
import {
  updateOlimpiadaEstado,
  getAreasCategoriasPorOlimpiada,
} from "../../../../api/Administration.api";
import OlympiadsModal from "../administrationModal/OlympiadsModal";
import BaseDataModal from "../administrationModal/BaseDataModal";
import { CiCircleInfo } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import "../../Styles/General.css";

const OlympiadsTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOlympiad, setSelectedOlympiad] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOlimpiads = async () => {
    try {
      const data = await getOlimpiadas();
      setOlympiads(data.data);
    } catch (error) {
      console.error("Error al obtener olimpiadas:", error);
      setOlympiads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOlimpiads();
  }, []);

  const handleView = (olympiad) => {
    setSelectedOlympiad(olympiad);
    setIsModalOpen(true);
  };

  const handleEdit = (olympiad) => {
    setSelectedOlympiad(olympiad);
    setIsEditModalOpen(true);
  };

  const toggleEstado = async (olympiad) => {
    try {
      const hoy = new Date().toISOString().split("T")[0];

      if (olympiad.estadoOlimpiada) {
        await updateOlimpiadaEstado(olympiad.idOlimpiada, 0);
        await fetchOlimpiads();
        return;
      }

      if (olympiad.fechaFinOlimpiada < hoy) {
        alert(
          "No puedes activar una olimpiada cuya fecha de fin ya ha pasado."
        );
        return;
      }

      const response = await getAreasCategoriasPorOlimpiada(
        olympiad.idOlimpiada
      );
      const data = Array.isArray(response) ? response : response.data || [];

      const tieneAsignaciones =
        data.length > 0 && data.some((area) => area.categorias.length > 0);

      if (!tieneAsignaciones) {
        alert(
          "No puedes activar esta olimpiada. No tiene áreas ni categorías registradas."
        );
        return;
      }

      await updateOlimpiadaEstado(olympiad.idOlimpiada, 1);
      await fetchOlimpiads();
    } catch (error) {
      console.error("Error al actualizar el estado de la olimpiada:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  const getEstadoLabel = (olympiad) => {
    const hoy = new Date().toISOString().split("T")[0];
    if (olympiad.fechaFinOlimpiada < hoy) return "Finalizado";
    return olympiad.estadoOlimpiada ? "Activo" : "Inactivo";
  };

  const getBadgeClass = (olympiad) => {
    const hoy = new Date().toISOString().split("T")[0];
    const isFinished = olympiad.fechaFinOlimpiada < hoy;
    const isActive = olympiad.estadoOlimpiada && !isFinished;

    return isActive ? "badge-success" : "badge-danger";
  };

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Versión</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Cargando olimpiadas...</td>
            </tr>
          ) : olympiads.length > 0 ? (
            olympiads.map((item) => (
              <tr key={item.idOlimpiada}>
                <td>{item.nombreOlimpiada}</td>
                <td>{item.version}</td>
                <td>{item.fechaInicioOlimpiada}</td>
                <td>{item.fechaFinOlimpiada}</td>
                <td>
                  <button
                    onClick={() => toggleEstado(item)}
                    className={getBadgeClass(item)}
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                    }}
                  >
                    {getEstadoLabel(item)}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleView(item)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                    }}
                  >
                    <CiCircleInfo />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    <MdEdit />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay olimpiadas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>

      <OlympiadsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        olimpiada={selectedOlympiad}
      />

      <BaseDataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedVersion={selectedOlympiad?.idOlimpiada}
      />
    </>
  );
};

export default OlympiadsTable;
