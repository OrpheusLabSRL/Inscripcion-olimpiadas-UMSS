import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Styles/Reports.css";

const OlympiadRegistrationsReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    olympiadName: true,
    edition: true,
    identityCard: true,
    firstName: true,
    lastName: true,
    totalRegistrations: false,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Nombre Olimpiada", value: "olympiadName" },
    { label: "Edición", value: "edition" },
    { label: "Carnet de Identidad", value: "identityCard" },
    { label: "Nombre", value: "firstName" },
    { label: "Apellido", value: "lastName" },
    { label: "Total de Inscripciones", value: "totalRegistrations" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("olympiadName");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get("/api/olympiad-registrations-report");
        if (response.data.success) {
          // Map backend keys to frontend keys in English
          const mappedData = response.data.data.map((item) => ({
            olympiadName: item.nombre_olimpiada,
            edition: item.edicion_olimpiada,
            identityCard: item.carnet_identidad_olimpista,
            firstName: item.nombre_olimpista,
            lastName: item.apellido_olimpista,
            totalRegistrations: item.total_olimpistas,
          }));
          setReportData(mappedData);
          setError(null);
        } else {
          setError("Error fetching the Olympiad Registrations report.");
          setReportData([]);
        }
      } catch (err) {
        setError("Error fetching the Olympiad Registrations report.");
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading)
    return <div className="report__status">Cargando reporte de inscripciones por olimpiada...</div>;
  if (error) return <div className="report__status">{error}</div>;

  // Filter rows based on rowFilter and selected filterColumn (case insensitive substring match)
  const filteredData = reportData.filter((item) => {
    let value = item[filterColumn];
    if (value !== undefined && value !== null) {
      return value.toString().toLowerCase().includes(rowFilter.toLowerCase());
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

  // Determine if participant columns are all hidden
  const participantColumnsHidden =
    !visibleColumns.identityCard &&
    !visibleColumns.firstName &&
    !visibleColumns.lastName;

  // Aggregate data by Olympiad and Edition if participant columns are hidden
  const displayedData = participantColumnsHidden
    ? Object.values(
        filteredData.reduce((acc, item) => {
          const key = item.olympiadName + '|' + item.edition;
          if (!acc[key]) {
            acc[key] = {
              olympiadName: item.olympiadName,
              edition: item.edition,
              totalRegistrations: 0,
            };
          }
          acc[key].totalRegistrations += 1;
          return acc;
        }, {})
      )
    : filteredData;

  return (
    <div className="olympiad-registrations-report">
      <div className="filter-controls">
        <div className="filter-controls-wrapper">
          <label className="filter-label">
            Filtrar por columna:
            <select
              className="filter-select"
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
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
              className="filter-input"
              value={rowFilter}
              onChange={(e) => setRowFilter(e.target.value)}
              placeholder={`Buscar en ${columnOptions.find((c) => c.value === filterColumn)?.label || ""}...`}
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

      <div className="report__table-container">
        <table className="report__table">
          <thead>
            <tr>
              {visibleColumns.olympiadName && <th>Nombre Olimpiada</th>}
              {visibleColumns.edition && <th>Edición</th>}
              {visibleColumns.identityCard && <th>Carnet de Identidad</th>}
              {visibleColumns.firstName && <th>Nombre</th>}
              {visibleColumns.lastName && <th>Apellido</th>}
              {visibleColumns.totalRegistrations && <th>Total de Inscripciones</th>}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <tr key={participantColumnsHidden ? item.olympiadName + '|' + item.edition : item.identityCard + index}>
                {visibleColumns.olympiadName && <td>{item.olympiadName}</td>}
                {visibleColumns.edition && <td>{item.edition}</td>}
                {visibleColumns.identityCard && <td>{item.identityCard}</td>}
                {visibleColumns.firstName && <td>{item.firstName}</td>}
                {visibleColumns.lastName && <td>{item.lastName}</td>}
                {visibleColumns.totalRegistrations && (
                  <td>{item.totalRegistrations}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OlympiadRegistrationsReport;
