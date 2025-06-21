import React, { useEffect, useState, useRef } from "react";
import { getAllOlimpistas } from "../../../../../api/inscription.api";
import "../../../Styles/Reports.css";

const OlympiansReportTable = () => {
  const [olympians, setOlympians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    idCard: true,
    firstName: true,
    lastName: true,
    birthDate: true,
    department: true,
    grade: true,
    school: true,
    areaName: true,
    categoryName: true,
  });

  // Dropdown options for columns
  const columnOptions = [
    { label: "Carnet de Identidad", value: "idCard" },
    { label: "Nombre", value: "firstName" },
    { label: "Apellido", value: "lastName" },
    { label: "Fecha de Nacimiento", value: "birthDate" },
    { label: "Departamento", value: "department" },
    { label: "Curso", value: "grade" },
    { label: "Colegio", value: "school" },
    { label: "Nombre Área", value: "areaName" },
    { label: "Nombre Categoría", value: "categoryName" },
  ];

  // Row filter state and selected filter column
  const [rowFilter, setRowFilter] = useState("");
  const [filterColumn, setFilterColumn] = useState("school");

  // Fix uncontrolled to controlled input warning by ensuring rowFilter is always a string
  const safeRowFilter = rowFilter || "";

  const reportRef = useRef(null);

    useEffect(() => {
      const fetchOlympians = async () => {
        try {
          const response = await getAllOlimpistas();
          console.log("API response for olimpistas:", response);
          if (response && response.success && response.data && response.data.length) {
            const mappedData = response.data.map(item => ({
              idCard: item.carnetDeIdentidad,
              firstName: item.nombre,
              lastName: item.apellido,
              birthDate: item.fechaNacimiento,
              department: item.departamento,
              grade: item.curso,
              school: item.colegio,
              areaName: item.nombreArea,
              categoryName: item.nombreCategoria,
            }));
            console.log("Mapped olympians data:", mappedData);
            setOlympians(mappedData);
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

  if (loading)
    return (
    <div className="report__status">
     Cargando reporte de olimpistas...
     </div>
     );
  if (error) return <div className="report__status">{error}</div>;

  // Filter rows based on rowFilter and selected filterColumn (case insensitive substring match)
  const filteredOlympians = olympians.filter((olympian) => {
    const value = olympian[filterColumn];
    if (value && typeof value === "string") {
      return value.toLowerCase().includes(rowFilter.toLowerCase());
    }
    return false;
  });

  // Determine if areaName or categoryName columns are visible
  const areaCategoryVisible = visibleColumns.areaName || visibleColumns.categoryName;

  // Group olympians by unique fields if areaName and categoryName columns are hidden
  const groupedOlympians = !areaCategoryVisible
    ? Object.values(
        filteredOlympians.reduce((acc, olympian) => {
          const key = `${olympian.idCard}-${olympian.firstName}-${olympian.lastName}-${olympian.birthDate}-${olympian.department}-${olympian.grade}-${olympian.school}`;
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
      <div className="report__table-container">
        <table className="report__table">
          <thead>
            <tr>
              {visibleColumns.idCard && <th>Carnet de Identidad</th>}
              {visibleColumns.firstName && <th>Nombre</th>}
              {visibleColumns.lastName && <th>Apellido</th>}
              {visibleColumns.birthDate && <th>Fecha de Nacimiento</th>}
              {visibleColumns.department && <th>Departamento</th>}
              {visibleColumns.grade && <th>Curso</th>}
              {visibleColumns.school && <th>Colegio</th>}
              {visibleColumns.areaName && <th>Nombre Área</th>}
              {visibleColumns.categoryName && <th>Nombre Categoría</th>}
            </tr>
          </thead>
          <tbody>
            {groupedOlympians.map((olympian, index) => (
              <tr key={olympian.id_olimpista ?? index}>
                {visibleColumns.idCard && <td>{olympian.idCard}</td>}
                {visibleColumns.firstName && <td>{olympian.firstName}</td>}
                {visibleColumns.lastName && <td>{olympian.lastName}</td>}
                {visibleColumns.birthDate && <td>{olympian.birthDate}</td>}
                {visibleColumns.department && <td>{olympian.department}</td>}
                {visibleColumns.grade && <td>{olympian.grade}</td>}
                {visibleColumns.school && <td>{olympian.school}</td>}
                {visibleColumns.areaName && <td>{olympian.areaName}</td>}
                {visibleColumns.categoryName && <td>{olympian.categoryName}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OlympiansReportTable;
