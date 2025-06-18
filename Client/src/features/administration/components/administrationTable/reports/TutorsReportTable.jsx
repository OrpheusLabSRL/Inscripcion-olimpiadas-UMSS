import React, { useEffect, useState } from "react";
import { getAllTutors } from "../../../../../api/inscription.api";
import "../../../Styles/Reports.css";

const TutorsReportTable = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    idCard: true,
    firstName: true,
    lastName: true,
    email: true,
    tutorType: true,
    phone: true,
    olympianIdCard: true,
    olympianFirstName: true,
    olympianLastName: true,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Carnet Identidad", value: "idCard" },
    { label: "Nombre", value: "firstName" },
    { label: "Apellido", value: "lastName" },
    { label: "Correo Electrónico", value: "email" },
    { label: "Tipo de Tutor", value: "tutorType" },
    { label: "Teléfono", value: "phone" },
    { label: "Carnet Olimpista", value: "olympianIdCard" },
    { label: "Nombre Olimpista", value: "olympianFirstName" },
    { label: "Apellido Olimpista", value: "olympianLastName" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("firstName");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await getAllTutors();
        // Map backend keys to frontend keys
        const mappedData = response.data.map(item => ({
          idCard: item.carnetIdentidad,
          firstName: item.nombre,
          lastName: item.apellido,
          email: item.correoElectronico,
          tutorType: item.tipoTutor,
          phone: item.telefono,
          olympianIdCard: item.carnetOlimpista,
          olympianFirstName: item.nombreOlimpista,
          olympianLastName: item.apellidoOlimpista,
        }));
        setTutors(mappedData);
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

  if (loading) return <p>Cargando reporte de tutores...</p>;
  if (error) return <p>{error}</p>;

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
    visibleColumns.olympianIdCard ||
    visibleColumns.olympianFirstName ||
    visibleColumns.olympianLastName;

  // Group tutors by unique tutor fields if olympian columns are hidden
  const groupedTutors = !olympianColumnsVisible
    ? Object.values(
        filteredTutors.reduce((acc, tutor) => {
          const key = `${tutor.idCard}-${tutor.firstName}-${tutor.lastName}-${tutor.email}-${tutor.tutorType}-${tutor.phone}`;
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
              {visibleColumns.idCard && <th>Carnet Identidad</th>}
              {visibleColumns.firstName && <th>Nombre</th>}
              {visibleColumns.lastName && <th>Apellido</th>}
              {visibleColumns.email && <th>Correo Electrónico</th>}
              {visibleColumns.tutorType && <th>Tipo de Tutor</th>}
              {visibleColumns.phone && <th>Teléfono</th>}
              {visibleColumns.olympianIdCard && <th>Carnet Olimpista</th>}
              {visibleColumns.olympianFirstName && <th>Nombre Olimpista</th>}
              {visibleColumns.olympianLastName && <th>Apellido Olimpista</th>}
            </tr>
          </thead>
          <tbody>
            {groupedTutors.map((tutor, index) => (
              <tr key={index}>
                {visibleColumns.idCard && <td>{tutor.idCard}</td>}
                {visibleColumns.firstName && <td>{tutor.firstName}</td>}
                {visibleColumns.lastName && <td>{tutor.lastName}</td>}
                {visibleColumns.email && <td>{tutor.email}</td>}
                {visibleColumns.tutorType && <td>{tutor.tutorType}</td>}
                {visibleColumns.phone && <td>{tutor.phone}</td>}
                {visibleColumns.olympianIdCard && <td>{tutor.olympianIdCard}</td>}
                {visibleColumns.olympianFirstName && <td>{tutor.olympianFirstName}</td>}
                {visibleColumns.olympianLastName && <td>{tutor.olympianLastName}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorsReportTable;
