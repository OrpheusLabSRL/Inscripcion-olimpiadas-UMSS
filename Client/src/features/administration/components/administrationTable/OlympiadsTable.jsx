import React, { useEffect, useState } from "react";
import {
  updateOlimpiadaEstado,
  getAreasCategoriasPorOlimpiada,
} from "../../../../api/Administration.api";
import { getOlimpiadas } from "../../../../api/inscription.api";
import OlympiadsModal from "../administrationModal/OlympiadsModal";
import BaseDataModal from "../administrationModal/BaseDataModal";
import { CiCircleInfo } from "react-icons/ci";
import { FaSpinner, FaTrash } from "react-icons/fa";
import "../../Styles/Tables.css";

const OlympiadsTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOlympiad, setSelectedOlympiad] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOlimpiads = async () => {
    try {
      const { data } = await getOlimpiadas();
      setOlympiads(data);
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

  const handleDelete = (olympiad) => {
    if (
      window.confirm(
        `¿Estás seguro que deseas eliminar la olimpiada "${olympiad.nombreOlimpiada}"?`
      )
    ) {
      // Aquí iría tu lógica de eliminación (API, estado, etc.)
      console.log("Eliminar olimpiada con ID:", olympiad.idOlimpiada);
    }
  };

  const toggleEstado = async (olympiad) => {
    const hoy = new Date();
    const fechaInicio = new Date(olympiad.fechaInicioOlimpiada);
    const fechaFin = new Date(olympiad.fechaFinOlimpiada);
    const isActive = olympiad.estadoOlimpiada === 1;

    if (fechaFin < hoy) {
      alert("No puedes modificar una olimpiada finalizada.");
      return;
    }
    if (fechaInicio <= hoy) {
      alert("No puedes modificar una olimpiada que ya comenzó.");
      return;
    }

    if (isActive) {
      try {
        await updateOlimpiadaEstado(olympiad.idOlimpiada, 0);
        await fetchOlimpiads();
      } catch (err) {
        console.error("Error al desactivar:", err);
        alert("No se pudo desactivar la olimpiada.");
      }
      return;
    }

    try {
      const response = await getAreasCategoriasPorOlimpiada(
        olympiad.idOlimpiada
      );
      const data = Array.isArray(response) ? response : response.data || [];

      const tieneAsignaciones =
        data.length > 0 && data.some((a) => a.categorias.length > 0);

      // if (!tieneAsignaciones) {
      //   alert("Debes asignar al menos un área y categoría para activarla.");
      //   return;
      // }

      await updateOlimpiadaEstado(olympiad.idOlimpiada, 1);
      await fetchOlimpiads();
    } catch (error) {
      console.error("Error al activar:", error);
      alert("No se pudo activar la olimpiada.");
    }
  };

  const getEstadoLabel = (olympiad) => {
    const hoy = new Date();
    const fechaInicio = new Date(olympiad.fechaInicioOlimpiada);
    const fechaFin = new Date(olympiad.fechaFinOlimpiada);

    if (fechaFin < hoy) return "Finalizado";
    if (fechaInicio > hoy && olympiad.estadoOlimpiada === 1) return "Pendiente";
    if (olympiad.estadoOlimpiada === 1) return "En proceso";
    return "Inactivo";
  };

  const getBadgeClass = (olympiad) => {
    const hoy = new Date();
    const fechaInicio = new Date(olympiad.fechaInicioOlimpiada);
    const fechaFin = new Date(olympiad.fechaFinOlimpiada);
    const isActive = olympiad.estadoOlimpiada === 1;

    if (fechaFin < hoy) return "tableUtilBadgeNeutral";
    if (fechaInicio > hoy && isActive) return "tableUtilBadgeDefault";
    if (isActive) return "tableUtilBadgeSuccess";
    return "tableUtilBadgeWarning";
  };

  return (
    <div className="olympiadTableWrapper">
      <table className="olympiadTable">
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
              <td colSpan="6" className="tableUtilLoading">
                <FaSpinner className="tableUtilSpinner" />
                Cargando olimpiadas...
              </td>
            </tr>
          ) : olympiads.length > 0 ? (
            olympiads.map((item) => (
              <tr key={item.idOlimpiada} className="olympiadTableRow">
                <td>{item.nombreOlimpiada}</td>
                <td>{item.version}</td>
                <td>{item.fechaInicioOlimpiada}</td>
                <td>{item.fechaFinOlimpiada}</td>
                <td>
                  <button
                    onClick={() => toggleEstado(item)}
                    className={`tableUtilStatusBadge ${getBadgeClass(item)}`}
                  >
                    {getEstadoLabel(item)}
                  </button>
                </td>
                <td className="olympiadTableActions">
                  <button
                    className="olympiadTableViewBtn"
                    onClick={() => handleView(item)}
                    title="Ver detalles"
                  >
                    <CiCircleInfo />
                  </button>
                  <FaTrash className="actionIcon deleteIcon" />{" "}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="tableUtilEmpty">
                No hay olimpiadas registradas.
              </td>
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
    </div>
  );
};

export default OlympiadsTable;
