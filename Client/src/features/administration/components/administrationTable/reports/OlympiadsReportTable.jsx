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

  if (loading) return <p style={{ color: "#000000" }}>Cargando reporte de olimpiadas...</p>;
  if (error) return <p style={{ color: "#000000" }}>{error}</p>;

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
    <div style={{ color: "#000000" }}>
      <div className="filter-controls" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <label style={{ color: "#000000" }}>
            Filtrar por columna:
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              style={{ marginLeft: "0.5rem", color: "#000000" }}
            >
              {columnOptions.map((col) => (
                <option key={col.value} value={col.value} style={{ color: "#000000" }}>
                  {col.label}
                </option>
              ))}
            </select>
          </label>
          <label style={{ color: "#000000" }}>
            Valor filtro:
            <input
              type="text"
              value={rowFilter}
              onChange={(e) => setRowFilter(e.target.value)}
              placeholder={`Buscar en ${
                columnOptions.find((c) => c.value === filterColumn)?.label || ""
              }...`}
              style={{ marginLeft: "0.5rem", color: "#000000" }}
            />
          </label>
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
      <div style={{ padding: "0 20px" }}>
        <table className="data-table">
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
                {visibleColumns.nombreOlimpiada && <td>{item.nombreOlimpiada}</td>}
                {visibleColumns.version && <td>{item.version}</td>}
                {visibleColumns.estadoOlimpiada && (
                  <td>
                    <span
                      className={`badge badge-${
                        item.estadoOlimpiada ? "success" : "danger"
                      }`}
                    >
                      {item.estadoOlimpiada ? "Activo" : "Finalizado"}
                    </span>
                  </td>
                )}
                {visibleColumns.fechaInicioOlimpiada && <td>{item.fechaInicioOlimpiada}</td>}
                {visibleColumns.fechaFinOlimpiada && <td>{item.fechaFinOlimpiada}</td>}
                {visibleColumns.area && <td>{item.area || ""}</td>}
                {visibleColumns.categoria && <td>{item.categoria || ""}</td>}
                {visibleColumns.fechaReserva && <td>{item.fechaReserva || ""}</td>}
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
