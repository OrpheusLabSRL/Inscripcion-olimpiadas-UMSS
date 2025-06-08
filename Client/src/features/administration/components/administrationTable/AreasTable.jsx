import React, { useEffect, useState } from "react";
import {
  getAreas,
  updateAreaStatus,
  deleteArea,
  verificarUsoArea, // Asegúrate de importar esto
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
  const [editingArea, setEditingArea] = useState(null);
  const [areasEnUso, setAreasEnUso] = useState(new Set());

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        const validAreas = Array.isArray(data) ? data : [];
        setAreas(validAreas);

        const usadas = new Set();
        await Promise.all(
          validAreas.map(async (area) => {
            try {
              const res = await verificarUsoArea(area.idArea);
              if (res.enUso) {
                usadas.add(area.idArea);
              }
            } catch (error) {
              console.error(
                "Error verificando uso del área",
                area.idArea,
                error
              );
            }
          })
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
                    <span
                      className={`tableUtilStatusBadge ${
                        area.estadoArea
                          ? "tableUtilBadgeSuccess"
                          : "tableUtilBadgeDanger"
                      }`}
                      onClick={() => toggleEstado(area.idArea, area.estadoArea)}
                      style={{ cursor: "pointer" }}
                    >
                      {area.estadoArea ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="tableActions">
                    <FaEdit
                      className="actionIcon editIcon"
                      title={
                        estaEnUso
                          ? "No se puede editar un área en uso"
                          : "Editar área"
                      }
                      onClick={() => !estaEnUso && handleEdit(area)}
                      style={{
                        cursor: estaEnUso ? "not-allowed" : "pointer",
                        opacity: estaEnUso ? 0.5 : 1,
                      }}
                    />
                    <FaTrash
                      className="actionIcon deleteIcon"
                      title={
                        estaEnUso
                          ? "No se puede eliminar un área en uso"
                          : "Eliminar área"
                      }
                      onClick={() => !estaEnUso && handleDelete(area.idArea)}
                      style={{
                        cursor: estaEnUso ? "not-allowed" : "pointer",
                        opacity: estaEnUso ? 0.5 : 1,
                      }}
                    />
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
