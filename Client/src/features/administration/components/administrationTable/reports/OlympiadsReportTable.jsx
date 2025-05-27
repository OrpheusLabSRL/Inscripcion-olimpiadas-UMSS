import React, { useEffect, useState } from "react";
import { getOlimpiadas } from "../../../../../api/Administration.api";
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
    fechaReserva: true,
    horaInicio: true,
    horaFin: true,
    nombreAula: true,
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
    { label: "Fecha Reserva", value: "fechaReserva" },
    { label: "Hora Inicio", value: "horaInicio" },
    { label: "Hora Fin", value: "horaFin" },
    { label: "Nombre Aula", value: "nombreAula" },
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

        <div className="olympiads-report__columns-selector">
          <span>Columnas a mostrar:</span>
          {columnOptions.map((col) => (
            <div key={col.value} className="olympiads-report__column-checkbox">
              <input
                type="checkbox"
                id={`col-${col.value}`}
                checked={visibleColumns[col.value]}
                onChange={() => toggleColumn(col.value)}
              />
              <label htmlFor={`col-${col.value}`}>{col.label}</label>
            </div>
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
              {visibleColumns.fechaReserva && <th>Fecha Reserva</th>}
              {visibleColumns.horaInicio && <th>Hora Inicio</th>}
              {visibleColumns.horaFin && <th>Hora Fin</th>}
              {visibleColumns.nombreAula && <th>Nombre Aula</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOlympiads.map((item, index) => (
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
                {visibleColumns.fechaReserva && (
                  <td>{item.fechaReserva || ""}</td>
                )}
                {visibleColumns.horaInicio && <td>{item.horaInicio || ""}</td>}
                {visibleColumns.horaFin && <td>{item.horaFin || ""}</td>}
                {visibleColumns.nombreAula && <td>{item.nombreAula || ""}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OlympiadsReportTable;
