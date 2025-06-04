import React, { useEffect, useState } from "react";
import {
  getAreas,
  updateAreaStatus,
  deleteArea,
} from "../../../../api/Administration.api";
import {
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import EditAreaModal from "../administrationModal/EditAreaModal";
import "../../Styles/Tables.css";

const AreasTable = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [editingArea, setEditingArea] = useState(null); // NUEVO estado

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(Array.isArray(data) ? data : []);
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
      const nuevoEstado = !currentEstado;
      await updateAreaStatus(id, nuevoEstado);
      setAreas((prev) =>
        prev.map((area) =>
          area.idArea === id ? { ...area, estadoArea: nuevoEstado } : area
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo actualizar el estado del área.");
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta área?"
    );
    if (!confirmDelete) return;

    try {
      await deleteArea(id);
      setAreas((prev) => prev.filter((area) => area.idArea !== id));
    } catch (error) {
      console.error("Error al eliminar área:", error);
      alert("No se pudo eliminar el área.");
    }
  };

  return (
    <>
      <table className="area-table">
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
              <td colSpan="4" className="table-util-loading">
                <FaSpinner className="table-util-spinner" />
                Cargando áreas...
              </td>
            </tr>
          ) : areas.length > 0 ? (
            areas.map((area) => {
              const shouldShowMore = needsExpand(area.descripcionArea);
              const isExpanded = expandedDescriptions[area.idArea];

              return (
                <tr key={area.idArea}>
                  <td className="table-util-text-left">{area.nombreArea}</td>
                  <td>
                    <div
                      className={`area-table-description-container ${
                        shouldShowMore && !isExpanded ? "has-more" : ""
                      } ${isExpanded ? "expanded" : ""}`}
                    >
                      <span className="area-table-description-content">
                        {area.descripcionArea || "—"}
                      </span>
                    </div>
                    {shouldShowMore && (
                      <span
                        className="area-table-see-more"
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
                  <td className="table-util-text-center">
                    <span
                      className={`table-util-status-badge ${
                        area.estadoArea
                          ? "table-util-badge-success"
                          : "table-util-badge-danger"
                      }`}
                      onClick={() => toggleEstado(area.idArea, area.estadoArea)}
                      style={{ cursor: "pointer" }}
                    >
                      {area.estadoArea ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="table-actions">
                    <FaEdit
                      className="action-icon edit-icon"
                      title="Editar área"
                      onClick={() => handleEdit(area)}
                    />
                    <FaTrash
                      className="action-icon delete-icon"
                      title="Eliminar área"
                      onClick={() => handleDelete(area.idArea)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="table-util-empty">
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
        onSuccess={() => {
          setEditingArea(null);
          setLoading(true);
          getAreas().then((data) => {
            setAreas(Array.isArray(data) ? data : []);
            setLoading(false);
          });
        }}
      />
    </>
  );
};

export default AreasTable;
