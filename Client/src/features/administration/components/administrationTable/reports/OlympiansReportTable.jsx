import React, { useEffect, useState, useRef } from "react";
import { getAllOlimpistas } from "../../../../../api/inscription.api";
import "../../../Styles/Reports.css";

const OlympiansReportTable = () => {
  const [olympians, setOlympians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    carnetDeIdentidad: true,
    nombre: true,
    apellido: true,
    fechaNacimiento: true,
    departamento: true,
    curso: true,
    colegio: true,
    nombreArea: true,
    nombreCategoria: true,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Carnet de Identidad", value: "carnetDeIdentidad" },
    { label: "Nombre", value: "nombre" },
    { label: "Apellido", value: "apellido" },
    { label: "Fecha de Nacimiento", value: "fechaNacimiento" },
    { label: "Departamento", value: "departamento" },
    { label: "Curso", value: "curso" },
    { label: "Colegio", value: "colegio" },
    { label: "Nombre Área", value: "nombreArea" },
    { label: "Nombre Categoría", value: "nombreCategoria" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("colegio");

  // Fix uncontrolled to controlled input warning by ensuring rowFilter is always a string
  const safeRowFilter = rowFilter || "";

  const reportRef = useRef(null);

  useEffect(() => {
    const fetchOlympians = async () => {
      try {
        const response = await getAllOlimpistas();
        if (response && response.data) {
          setOlympians(response.data);
          setError(null);
        } else {
          setOlympians([]);
          setError("No se encontraron olimpistas.");
        }
      } catch (err) {
        setError("Error al obtener los olimpistas.");
        setOlympians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOlympians();
  }, []);

  if (loading) return <p style={{ color: "#000000" }}>Cargando reporte de olimpistas...</p>;
  if (error) return <p style={{ color: "#000000" }}>{error}</p>;

  // Filter rows based on rowFilter and selected filterColumn (case insensitive substring match)
  const filteredOlympians = olympians.filter((olympian) => {
    const value = olympian[filterColumn];
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
        <div style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
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
              value={safeRowFilter}
              onChange={(e) => setRowFilter(e.target.value)}
              placeholder={`Buscar en ${columnOptions.find(c => c.value === filterColumn)?.label || ''}...`}
              style={{ marginLeft: "0.5rem", color: "#000000" }}
            />
          </label>
        </div>
        <div>
          <span style={{ color: "#000000" }}>Columnas a mostrar:</span>
          {columnOptions.map((col) => (
            <label
              key={col.value}
              style={{ marginLeft: "1rem", display: "inline-flex", alignItems: "center", color: "#000000" }}
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
      <div ref={reportRef} style={{ padding: "0 20px" }}>
        <table className="data-table">
          <thead>
            <tr>
              {visibleColumns.carnetDeIdentidad && <th>Carnet de Identidad</th>}
              {visibleColumns.nombre && <th>Nombre</th>}
              {visibleColumns.apellido && <th>Apellido</th>}
              {visibleColumns.fechaNacimiento && <th>Fecha de Nacimiento</th>}
              {visibleColumns.departamento && <th>Departamento</th>}
              {visibleColumns.curso && <th>Curso</th>}
              {visibleColumns.colegio && <th>Colegio</th>}
              {visibleColumns.nombreArea && <th>Nombre Área</th>}
              {visibleColumns.nombreCategoria && <th>Nombre Categoría</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOlympians.map((olympian, index) => (
              <tr key={olympian.id_olimpista ?? index}>
                {visibleColumns.carnetDeIdentidad && <td>{olympian.carnetDeIdentidad}</td>}
                {visibleColumns.nombre && <td>{olympian.nombre}</td>}
                {visibleColumns.apellido && <td>{olympian.apellido}</td>}
                {visibleColumns.fechaNacimiento && <td>{olympian.fechaNacimiento}</td>}
                {visibleColumns.departamento && <td>{olympian.departamento}</td>}
                {visibleColumns.curso && <td>{olympian.curso}</td>}
                {visibleColumns.colegio && <td>{olympian.colegio}</td>}
                {visibleColumns.nombreArea && <td>{olympian.nombreArea}</td>}
                {visibleColumns.nombreCategoria && <td>{olympian.nombreCategoria}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OlympiansReportTable;
