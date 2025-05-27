import React, { useEffect, useState } from "react";
import { getAreas } from "../../../../api/Administration.api";
import { FaSpinner, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../Styles/Tables.css";

const AreasTable = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

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

  return (
    <table className="area-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="3" className="table-util-loading">
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
                  >
                    {area.estadoArea ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="3" className="table-util-empty">
              No hay áreas registradas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AreasTable;
