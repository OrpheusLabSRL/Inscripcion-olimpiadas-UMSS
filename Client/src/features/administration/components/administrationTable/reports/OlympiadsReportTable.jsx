import React, { useEffect, useState } from "react";
import { getOlimpiadasConAreasCategorias } from "../../../../../api/Administration.api";
import "../../../Styles/Reports.css";

const OlympiadsReportTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    olympiadName: true,
    version: true,
    status: true,
    startDate: true,
    endDate: true,
    area: true,
    category: true,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Nombre Olimpiada", value: "olympiadName" },
    { label: "Versión", value: "version" },
    { label: "Estado", value: "status" },
    { label: "Fecha Inicio", value: "startDate" },
    { label: "Fecha Fin", value: "endDate" },
    { label: "Área", value: "area" },
    { label: "Categoría", value: "category" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("olympiadName");

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        const response = await getOlimpiadasConAreasCategorias();
        // Map backend keys to frontend keys
        const mappedData = response.data.map(item => ({
          olympiadName: item.nombreOlimpiada,
          version: item.version,
          status: item.estadoOlimpiada,
          startDate: item.fechaInicioOlimpiada,
          endDate: item.fechaFinOlimpiada,
          area: item.nombreArea,
          category: item.nombreCategoria,
        }));
        setOlympiads(mappedData);
        setError(null);
      } catch (err) {
        setError("Error al obtener las olimpiadas.");
        setOlympiads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOlympiads();
  }, []);

  if (loading)
    return (
      <div className="olympiads-report__status">
        Cargando reporte de olimpiadas...
      </div>
    );
  if (error) return <div className="olympiads-report__status">{error}</div>;

  // Filter rows based on rowFilter and selected filterColumn (case insensitive substring match)
  const filteredOlympiads = olympiads.filter((item) => {
    let value = item[filterColumn];
    if (filterColumn === "status") {
      // Convert boolean to string for filtering
      value = value ? "Activo" : "Finalizado";
    }
    if (value && typeof value === "string") {
      return value.toLowerCase().includes(rowFilter.toLowerCase());
    }
    return false;
  });

  // Determine if Area or Category columns are visible
  const areaCategoryVisible = visibleColumns.area || visibleColumns.category;

  // Group olympiads by unique fields if Area and Category columns are hidden
  const groupedOlympiads = !areaCategoryVisible
    ? Object.values(
        filteredOlympiads.reduce((acc, item) => {
          const key = `${item.olympiadName}-${item.version}-${item.status}-${item.startDate}-${item.endDate}`;
          if (!acc[key]) {
            acc[key] = { ...item };
          }
          return acc;
        }, {})
      )
    : filteredOlympiads;

  // Toggle column visibility handler
  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="olympiads-report">
      <div className="olympiads-report__header">
        <h2 className="olympiads-report__title">Reporte de Olimpiadas</h2>

        <div className="olympiads-report__controls">
          <div className="filter-controls-wrapper">
            <div className="olympiads-report__filter-group">
              <label>Filtrar por columna:</label>
              <select
                className="olympiads-report__filter-select"
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
              >
                {columnOptions.map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="olympiads-report__filter-group">
              <label>Valor filtro:</label>
              <input
                type="text"
                className="olympiads-report__filter-input"
                value={rowFilter}
                onChange={(e) => setRowFilter(e.target.value)}
                placeholder={`Buscar en ${
                  columnOptions.find((c) => c.value === filterColumn)?.label || ""
                }...`}
              />
            </div>
          </div>
        </div>

        <div>
          <span style={{ color: "#000000" }}>Columnas a mostrar:</span>
          {columnOptions.map((col) => (
            <label
              key={col.value}
              style={{
                marginLeft: "1rem",
                color: "#000000",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={visibleColumns[col.value]}
                onChange={() => toggleColumn(col.value)}
                style={{ marginRight: "0.25rem" }}
              />
              {col.label}
            </label>
          ))}
        </div>
      </div>

      <div className="olympiads-report__table-container">
        <table className="olympiads-report__table">
          <thead>
            <tr>
              {visibleColumns.olympiadName && <th>Nombre Olimpiada</th>}
              {visibleColumns.version && <th>Versión</th>}
              {visibleColumns.status && <th>Estado</th>}
              {visibleColumns.startDate && <th>Fecha Inicio</th>}
              {visibleColumns.endDate && <th>Fecha Fin</th>}
              {visibleColumns.area && <th>Área</th>}
              {visibleColumns.category && <th>Categoría</th>}
            </tr>
          </thead>
          <tbody>
            {groupedOlympiads.map((item, index) => (
              <tr key={index}>
                {visibleColumns.olympiadName && (
                  <td>{item.olympiadName}</td>
                )}
                {visibleColumns.version && <td>{item.version}</td>}
                {visibleColumns.status && (
                  <td>
                    <span
                      className={`olympiads-report__badge ${
                        item.status
                          ? "olympiads-report__badge--success"
                          : "olympiads-report__badge--danger"
                      }`}
                    >
                      {item.status ? "Activo" : "Finalizado"}
                    </span>
                  </td>
                )}
                {visibleColumns.startDate && (
                  <td>{item.startDate}</td>
                )}
                {visibleColumns.endDate && (
                  <td>{item.endDate}</td>
                )}
                {visibleColumns.area && <td>{item.area || ""}</td>}
                {visibleColumns.category && <td>{item.category || ""}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OlympiadsReportTable;
