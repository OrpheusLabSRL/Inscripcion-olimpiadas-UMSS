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

  // Determine if Nombre Área or Nombre Categoría columns are visible
  const areaCategoriaVisible = visibleColumns.nombreArea || visibleColumns.nombreCategoria;

  // Group olympians by unique fields if Nombre Área and Nombre Categoría columns are hidden
  const groupedOlympians = !areaCategoriaVisible
    ? Object.values(
        filteredOlympians.reduce((acc, olympian) => {
          const key = `${olympian.carnetDeIdentidad}-${olympian.nombre}-${olympian.apellido}-${olympian.fechaNacimiento}-${olympian.departamento}-${olympian.curso}-${olympian.colegio}`;
          if (!acc[key]) {
            acc[key] = { ...olympian };
          }
          return acc;
        }, {})
      )
    : filteredOlympians;

  // Toggle column visibility handler
  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="olympians-report">
      <div className="filter-controls">
        <div className="filter-controls-wrapper">
          <label className="filter-label">
            Filtrar por columna:
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="filter-select"
            >
              {columnOptions.map((col) => (
                <option key={col.value} value={col.value} className="filter-option">
                  {col.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-label">
            Valor filtro:
            <input
              type="text"
              value={safeRowFilter}
              onChange={(e) => setRowFilter(e.target.value)}
              placeholder={`Buscar en ${columnOptions.find(c => c.value === filterColumn)?.label || ''}...`}
              className="filter-input"
            />
          </label>
        </div>
        <div>
          <span className="filter-label">Columnas a mostrar:</span>
          {columnOptions.map((col) => (
            <label key={col.value} className="columns-to-show">
              <input
                type="checkbox"
                checked={visibleColumns[col.value]}
                onChange={() => toggleColumn(col.value)}
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
            {groupedOlympians.map((olympian, index) => (
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
