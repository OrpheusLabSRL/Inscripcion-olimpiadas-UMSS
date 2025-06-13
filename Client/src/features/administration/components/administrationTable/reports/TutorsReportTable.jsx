import React, { useEffect, useState } from "react";
import { getAllTutors } from "../../../../../api/inscription.api";
import "../../../Styles/Reports.css";

const TutorsReportTable = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    carnetIdentidad: true,
    nombre: true,
    apellido: true,
    correoElectronico: true,
    tipoTutor: true,
    telefono: true,
    carnetOlimpista: true,
    nombreOlimpista: true,
    apellidoOlimpista: true,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Carnet Identidad", value: "carnetIdentidad" },
    { label: "Nombre", value: "nombre" },
    { label: "Apellido", value: "apellido" },
    { label: "Correo Electrónico", value: "correoElectronico" },
    { label: "Tipo de Tutor", value: "tipoTutor" },
    { label: "Teléfono", value: "telefono" },
    { label: "Carnet Olimpista", value: "carnetOlimpista" },
    { label: "Nombre Olimpista", value: "nombreOlimpista" },
    { label: "Apellido Olimpista", value: "apellidoOlimpista" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("nombre");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await getAllTutors();
        setTutors(response.data);
        setError(null);
      } catch (err) {
        setError("Error al obtener los tutores.");
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) return <p style={{ color: "#000000" }}>Cargando reporte de tutores...</p>;
  if (error) return <p style={{ color: "#000000" }}>{error}</p>;

  // Filter rows based on rowFilter and selected filterColumn (case insensitive substring match)
  const filteredTutors = tutors.filter((tutor) => {
    const value = tutor[filterColumn];
    if (value && typeof value === "string") {
      return value.toLowerCase().includes(rowFilter.toLowerCase());
    }
    return false;
  });

  // Determine if any olympian columns are visible
  const olympianColumnsVisible =
    visibleColumns.carnetOlimpista ||
    visibleColumns.nombreOlimpista ||
    visibleColumns.apellidoOlimpista;

  // Group tutors by unique tutor fields if olympian columns are hidden
  const groupedTutors = !olympianColumnsVisible
    ? Object.values(
        filteredTutors.reduce((acc, tutor) => {
          const key = `${tutor.carnetIdentidad}-${tutor.nombre}-${tutor.apellido}-${tutor.correoElectronico}-${tutor.tipoTutor}-${tutor.telefono}`;
          if (!acc[key]) {
            acc[key] = { ...tutor };
          }
          return acc;
        }, {})
      )
    : filteredTutors;

  // Toggle column visibility handler
  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="tutors-report">
      <div className="tutors-filter-controls">
        <div className="tutors-filter-controls-wrapper">
          <label className="tutors-filter-label">
            Filtrar por columna:
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="tutors-filter-select"
            >
              {columnOptions.map((col) => (
                <option
                  key={col.value}
                  value={col.value}
                  className="tutors-filter-option"
                >
                  {col.label}
                </option>
              ))}
            </select>
          </label>
          <label className="tutors-filter-label">
            Valor filtro:
            <input
              type="text"
              value={rowFilter}
              onChange={(e) => setRowFilter(e.target.value)}
              placeholder={`Buscar en ${
                columnOptions.find((c) => c.value === filterColumn)?.label || ""
              }...`}
              className="tutors-filter-input"
            />
          </label>
        </div>
        <div>
          <span className="tutors-filter-label">Columnas a mostrar:</span>
          {columnOptions.map((col) => (
            <label key={col.value} className="tutors-columns-to-show">
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
              {visibleColumns.carnetIdentidad && <th>Carnet Identidad</th>}
              {visibleColumns.nombre && <th>Nombre</th>}
              {visibleColumns.apellido && <th>Apellido</th>}
              {visibleColumns.correoElectronico && <th>Correo Electrónico</th>}
              {visibleColumns.tipoTutor && <th>Tipo de Tutor</th>}
              {visibleColumns.telefono && <th>Teléfono</th>}
              {visibleColumns.carnetOlimpista && <th>Carnet Olimpista</th>}
              {visibleColumns.nombreOlimpista && <th>Nombre Olimpista</th>}
              {visibleColumns.apellidoOlimpista && <th>Apellido Olimpista</th>}
            </tr>
          </thead>
          <tbody>
            {groupedTutors.map((tutor, index) => (
              <tr key={index}>
                {visibleColumns.carnetIdentidad && <td>{tutor.carnetIdentidad}</td>}
                {visibleColumns.nombre && <td>{tutor.nombre}</td>}
                {visibleColumns.apellido && <td>{tutor.apellido}</td>}
                {visibleColumns.correoElectronico && <td>{tutor.correoElectronico}</td>}
                {visibleColumns.tipoTutor && <td>{tutor.tipoTutor}</td>}
                {visibleColumns.telefono && <td>{tutor.telefono}</td>}
                {visibleColumns.carnetOlimpista && <td>{tutor.carnetOlimpista}</td>}
                {visibleColumns.nombreOlimpista && <td>{tutor.nombreOlimpista}</td>}
                {visibleColumns.apellidoOlimpista && <td>{tutor.apellidoOlimpista}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorsReportTable;
