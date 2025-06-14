import React, { useEffect, useState } from "react";
import { getOlimpiadas, getOlimpiadasConAreasCategorias } from "../../../../../api/Administration.api";
import "../../../Styles/Reports.css";

const OlympiadsReportTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    nombreOlimpiada: true,
    version: true,
    estadoOlimpiada: true,
    fechaInicioOlimpiada: true,
    fechaFinOlimpiada: true,
    area: true,
    categoria: true,
    // Removed columns as per user request
    // fechaReserva: true,
    // horaInicio: true,
    // horaFin: true,
    // nombreAula: true,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Nombre Olimpiada", value: "nombreOlimpiada" },
    { label: "Versión", value: "version" },
    { label: "Estado", value: "estadoOlimpiada" },
    { label: "Fecha Inicio", value: "fechaInicioOlimpiada" },
    { label: "Fecha Fin", value: "fechaFinOlimpiada" },
    { label: "Área", value: "area" },
    { label: "Categoría", value: "categoria" },
    // Removed columns as per user request
    // { label: "Fecha Reserva", value: "fechaReserva" },
    // { label: "Hora Inicio", value: "horaInicio" },
    // { label: "Hora Fin", value: "horaFin" },
    // { label: "Nombre Aula", value: "nombreAula" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("nombreOlimpiada");

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        const response = await getOlimpiadas();
        setOlympiads(response.data);
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
    if (filterColumn === "estadoOlimpiada") {
      // Convert boolean to string for filtering
      value = value ? "Activo" : "Finalizado";
    }
    if (value && typeof value === "string") {
      return value.toLowerCase().includes(rowFilter.toLowerCase());
    }
    return false;
  });

  // Determine if Area or Categoria columns are visible
  const areaCategoriaVisible = visibleColumns.area || visibleColumns.categoria;

  // Group olympiads by unique fields if Area and Categoria columns are hidden
  const groupedOlympiads = !areaCategoriaVisible
    ? Object.values(
        filteredOlympiads.reduce((acc, item) => {
          const key = `${item.nombreOlimpiada}-${item.version}-${item.estadoOlimpiada}-${item.fechaInicioOlimpiada}-${item.fechaFinOlimpiada}`;
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
              {visibleColumns.nombreOlimpiada && <th>Nombre Olimpiada</th>}
              {visibleColumns.version && <th>Versión</th>}
              {visibleColumns.estadoOlimpiada && <th>Estado</th>}
              {visibleColumns.fechaInicioOlimpiada && <th>Fecha Inicio</th>}
              {visibleColumns.fechaFinOlimpiada && <th>Fecha Fin</th>}
              {visibleColumns.area && <th>Área</th>}
              {visibleColumns.categoria && <th>Categoría</th>}
            </tr>
          </thead>
          <tbody>
            {groupedOlympiads.map((item, index) => (
              <tr key={index}>
                {visibleColumns.nombreOlimpiada && (
                  <td>{item.nombreOlimpiada}</td>
                )}
                {visibleColumns.version && <td>{item.version}</td>}
                {visibleColumns.estadoOlimpiada && (
                  <td>
                    <span
                      className={`olympiads-report__badge ${
                        item.estadoOlimpiada
                          ? "olympiads-report__badge--success"
                          : "olympiads-report__badge--danger"
                      }`}
                    >
                      {item.estadoOlimpiada ? "Activo" : "Finalizado"}
                    </span>
                  </td>
                )}
                {visibleColumns.fechaInicioOlimpiada && (
                  <td>{item.fechaInicioOlimpiada}</td>
                )}
                {visibleColumns.fechaFinOlimpiada && (
                  <td>{item.fechaFinOlimpiada}</td>
                )}
                {visibleColumns.area && <td>{item.area || ""}</td>}
                {visibleColumns.categoria && <td>{item.categoria || ""}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OlympiadsReportTable;
