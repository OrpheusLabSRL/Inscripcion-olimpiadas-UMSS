import React, { useEffect, useState } from "react";
import {
  getAreas,
  updateAreaStatus,
  deleteArea,
  verificarUsoAreasMasivo,
} from "../../../../api/Administration.api";
import {
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import EditAreaModal from "../administrationModal/EditAreaModal";
import "../../Styles/Tables.css";
import Swal from "sweetalert2";

const AreasTable = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [editingArea, setEditingArea] = useState(null);
  const [areasEnUso, setAreasEnUso] = useState(new Set());

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        const validAreas = Array.isArray(data) ? data : [];
        setAreas(validAreas);

        const ids = validAreas.map((area) => area.idArea);
        const resultados = await verificarUsoAreasMasivo(ids);

        const usadas = new Set(
          Object.entries(resultados)
            .filter(([_, info]) => info.enUso)
            .map(([id]) => parseInt(id))
        );

        setAreasEnUso(usadas);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const needsExpand = (text) => {
    if (!text) return false;
    const approxCharsPerLine = 50;
    const maxLines = 3;
    return text.length > approxCharsPerLine * maxLines;
  };

  const toggleEstado = async (id, currentEstado) => {
    try {
      if (currentEstado) {
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          html: `
            <p>Al desactivar esta área:</p>
            <ul style="text-align: left; margin-left: 20px;">
              <li>No estará disponible para nuevas olimpiadas</li>
              <li>Las olimpiadas existentes que ya la incluyen <strong>NO</strong> se verán afectadas</li>
            </ul>
            <p>¿Deseas continuar?</p>
          `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, desactivar",
          cancelButtonText: "Cancelar",
          customClass: {
            container: "swal2-container",
            popup: "swal2-popup-custom",
          },
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      const nuevoEstado = !currentEstado;
      await updateAreaStatus(id, nuevoEstado);
      setAreas((prev) =>
        prev.map((area) =>
          area.idArea === id ? { ...area, estadoArea: nuevoEstado } : area
        )
      );

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `El area ha sido ${nuevoEstado ? "activada" : "desactivada"}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado del área",
        icon: "error",
      });
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar permanentemente esta área?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        container: "swal2-container",
      },
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await deleteArea(id);
      setAreas((prev) => prev.filter((area) => area.idArea !== id));
      Swal.fire({
        title: "Eliminada",
        text: "El área ha sido eliminada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar área:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el área",
        icon: "error",
      });
    }
  };

  return (
    <>
      <table className="areaTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="tableUtilLoading">
                <FaSpinner className="tableUtilSpinner" />
                Cargando áreas...
              </td>
            </tr>
          ) : areas.length > 0 ? (
            areas.map((area) => {
              const shouldShowMore = needsExpand(area.descripcionArea);
              const isExpanded = expandedDescriptions[area.idArea];
              const estaEnUso = areasEnUso.has(area.idArea);

              return (
                <tr key={area.idArea}>
                  <td className="tableUtilTextLeft">{area.nombreArea}</td>
                  <td>
                    <div
                      className={`areaTableDescriptionContainer ${
                        shouldShowMore && !isExpanded ? "hasMore" : ""
                      } ${isExpanded ? "expanded" : ""}`}
                    >
                      <span className="areaTableDescriptionContent">
                        {area.descripcionArea || "—"}
                      </span>
                    </div>
                    {shouldShowMore && (
                      <span
                        className="areaTableSeeMore"
                        onClick={() => toggleDescription(area.idArea)}
                      >
                        {isExpanded ? (
                          <>
                            <FaChevronUp size={10} /> Ver menos
                          </>
                        ) : (
                          <>
                            <FaChevronDown size={10} /> Ver más
                          </>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="tableUtilTextCenter">
                    <button
                      className={`tableUtilStatusToggle ${
                        area.estadoArea ? "active" : "inactive"
                      }`}
                      onClick={() => toggleEstado(area.idArea, area.estadoArea)}
                      title={area.estadoArea ? "Desactivar" : "Activar"}
                    >
                      {area.estadoArea ? (
                        <FaToggleOn className="toggleIcon active" />
                      ) : (
                        <FaToggleOff className="toggleIcon inactive" />
                      )}
                      <span>{area.estadoArea ? "Activo" : "Inactivo"}</span>
                    </button>
                  </td>
                  <td className="tableActions">
                    <div className="actionButtons">
                      <button
                        className={`actionButton editButton ${
                          estaEnUso ? "disabled" : ""
                        }`}
                        onClick={() => !estaEnUso && handleEdit(area)}
                        disabled={estaEnUso}
                        title={
                          estaEnUso
                            ? "No se puede editar un área en uso"
                            : "Editar área"
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`actionButton deleteButton ${
                          estaEnUso ? "disabled" : ""
                        }`}
                        onClick={() => !estaEnUso && handleDelete(area.idArea)}
                        disabled={estaEnUso}
                        title={
                          estaEnUso
                            ? "No se puede eliminar un área en uso"
                            : "Eliminar área"
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="tableUtilEmpty">
                No hay áreas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <EditAreaModal
        isOpen={!!editingArea}
        area={editingArea}
        onClose={() => setEditingArea(null)}
        onSuccess={async () => {
          setEditingArea(null);
          setLoading(true);
          const data = await getAreas();
          setAreas(Array.isArray(data) ? data : []);
          setLoading(false);
        }}
      />
    </>
  );
};

export default AreasTable;
