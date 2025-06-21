import React, { useEffect, useState } from "react";
import {
  updateOlimpiadaEstado,
  getAreasCategoriasPorOlimpiada,
  getOlimpiadas,
  deleteOlympiad,
} from "../../../../api/Administration.api";
import OlympiadsModal from "../administrationModal/ViewOlympiadsModal";
import EditOlympiadModal from "../administrationModal/EditOlympiadModal";
import { CiCircleInfo } from "react-icons/ci";
import { FiEdit2 } from "react-icons/fi";
import { FaSpinner, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../Styles/Tables.css";

const OlympiadsTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOlympiad, setSelectedOlympiad] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [editingOlympiad, setEditingOlympiad] = useState(null);

  const fetchOlimpiads = async () => {
    try {
      setLoading(true);
      const { data } = await getOlimpiadas();
      setOlympiads(data);
    } catch (error) {
      console.error("Error al obtener olimpiadas:", error);
      setOlympiads([]);
      await Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las olimpiadas",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
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
    setEditingOlympiad(olympiad);
  };

  const handleDelete = async (olympiad) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${olympiad.nombreOlimpiada}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setProcessing(true);
        await deleteOlympiad(olympiad.idOlimpiada);
        await Swal.fire({
          title: "¡Eliminada!",
          text: `La olimpiada "${olympiad.nombreOlimpiada}" ha sido eliminada`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        await fetchOlimpiads();
      } catch (error) {
        console.error("Error al eliminar olimpiada:", error);
        await Swal.fire({
          title: "Error",
          text: `No se pudo eliminar "${olympiad.nombreOlimpiada}"`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setProcessing(false);
      }
    }
  };

  const toggleEstado = async (olympiad) => {
    const hoy = new Date();
    const fechaInicio = new Date(olympiad.fechaInicioOlimpiada);
    const fechaFin = new Date(olympiad.fechaFinOlimpiada);
    const isActive = olympiad.estadoOlimpiada === 1;

    if (fechaFin < hoy) {
      await Swal.fire({
        title: "No permitido",
        text: "No puedes modificar una olimpiada finalizada",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    if (fechaInicio <= hoy) {
      await Swal.fire({
        title: "No permitido",
        text: "No puedes modificar una olimpiada que ya comenzó",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const result = await Swal.fire({
      title: isActive
        ? `¿Desactivar "${olympiad.nombreOlimpiada}"?`
        : `¿Activar "${olympiad.nombreOlimpiada}"?`,
      text: isActive
        ? "La olimpiada ya no estará disponible"
        : "La olimpiada quedará habilitada para participación",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isActive ? "Sí, desactivar" : "Sí, activar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setProcessing(true);
        const newEstado = isActive ? 0 : 1;

        if (!isActive) {
          const response = await getAreasCategoriasPorOlimpiada(
            olympiad.idOlimpiada
          );
          const data = Array.isArray(response) ? response : response.data || [];
          const tieneAsignaciones =
            data.length > 0 && data.some((a) => a.categorias.length > 0);
        }

        await updateOlimpiadaEstado(olympiad.idOlimpiada, newEstado);
        await Swal.fire({
          title: "¡Cambio realizado!",
          text: `La olimpiada "${olympiad.nombreOlimpiada}" ahora está ${
            newEstado ? "activa" : "inactiva"
          }`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        await fetchOlimpiads();
      } catch (error) {
        console.error("Error al cambiar el estado:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudo cambiar el estado",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setProcessing(false);
      }
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

  const getEstadoClass = (olympiad) => {
    const hoy = new Date();
    const fechaInicio = new Date(olympiad.fechaInicioOlimpiada);
    const fechaFin = new Date(olympiad.fechaFinOlimpiada);
    const isActive = olympiad.estadoOlimpiada === 1;

    if (fechaFin < hoy) return "neutral";
    if (fechaInicio > hoy && isActive) return "default";
    if (isActive) return "active";
    return "inactive";
  };

  return (
    <div className="olympiadTableWrapper">
      {processing && (
        <div className="processing-overlay">
          <FaSpinner className="spinner" />
          <span>Procesando...</span>
        </div>
      )}

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
                <td>
                  {new Date(
                    item.fechaInicioOlimpiada + "T00:00:00"
                  ).toLocaleDateString()}
                </td>
                <td>
                  {new Date(
                    item.fechaFinOlimpiada + "T00:00:00"
                  ).toLocaleDateString()}
                </td>
                <td className="tableUtilTextCenter">
                  <button
                    className={`tableUtilStatusToggle ${getEstadoClass(item)}`}
                    onClick={() => toggleEstado(item)}
                    title={
                      getEstadoLabel(item) === "Finalizado" ||
                      getEstadoLabel(item) === "En proceso"
                        ? "No se puede modificar"
                        : getEstadoLabel(item) === "Pendiente"
                        ? "Desactivar"
                        : "Activar"
                    }
                    disabled={
                      getEstadoLabel(item) === "Finalizado" ||
                      getEstadoLabel(item) === "En proceso" ||
                      processing
                    }
                  >
                    {getEstadoLabel(item) === "Finalizado" ||
                    getEstadoLabel(item) === "En proceso" ? (
                      <span>{getEstadoLabel(item)}</span>
                    ) : item.estadoOlimpiada === 1 ? (
                      <FaToggleOn className="toggleIcon active" />
                    ) : (
                      <FaToggleOff className="toggleIcon inactive" />
                    )}
                    {getEstadoLabel(item) === "Pendiente" ||
                    getEstadoLabel(item) === "Inactivo" ? (
                      <span>{getEstadoLabel(item)}</span>
                    ) : null}
                  </button>
                </td>
                <td className="tableActions">
                  <div className="actionButtons">
                    <button
                      className="actionButton viewButton"
                      onClick={() => handleView(item)}
                      title="Ver detalles"
                      disabled={processing}
                    >
                      <CiCircleInfo />
                    </button>
                    <button
                      className="actionButton editButton"
                      onClick={() => handleEdit(item)}
                      title="Editar olimpiada"
                      disabled={
                        processing ||
                        getEstadoLabel(item) === "En proceso" ||
                        getEstadoLabel(item) === "Finalizado"
                      }
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={`actionButton deleteButton ${
                        getEstadoLabel(item) === "En proceso" ||
                        getEstadoLabel(item) === "Finalizado"
                          ? "disabled"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          getEstadoLabel(item) !== "En proceso" &&
                          getEstadoLabel(item) !== "Finalizado"
                        ) {
                          handleDelete(item);
                        }
                      }}
                      title={
                        getEstadoLabel(item) === "En proceso" ||
                        getEstadoLabel(item) === "Finalizado"
                          ? "No se puede eliminar una olimpiada en proceso o finalizada"
                          : "Eliminar olimpiada"
                      }
                      disabled={
                        getEstadoLabel(item) === "En proceso" ||
                        getEstadoLabel(item) === "Finalizado" ||
                        processing
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
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

      <EditOlympiadModal
        isOpen={!!editingOlympiad}
        olympiad={editingOlympiad}
        onClose={() => setEditingOlympiad(null)}
        onSuccess={fetchOlimpiads}
      />
    </div>
  );
};

export default OlympiadsTable;
