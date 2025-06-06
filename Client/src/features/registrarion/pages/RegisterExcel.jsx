import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../Styles/RegisterExcel.css";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  validateExcelData,
  registerFromExcel,
} from "../../../api/inscriptionExcel.api";
import swal from "sweetalert";
import { IoArrowBackCircle } from "react-icons/io5";

const RegisterExcel = () => {
  const [data, setData] = useState([]);
  const [headers] = useState([
    "CARNET DE IDENTIDAD (OLIMPISTA)",
    "NOMBRE(S) (OLIMPISTA)",
    "APELLIDO(S) (OLIMPISTA)",
    "FECHA DE NACIMIENTO (OLIMPISTA)",
    "CORREO ELECTRONICO (OLIMPISTA)",
    "DEPARTAMENTO (OLIMPISTA)",
    "MUNICIPIO (OLIMPISTA)",
    "COLEGIO (OLIMPISTA)",
    "CURSO (OLIMPISTA)",
    "AREA",
    "CATEGORIA",
    "CARNET DE IDENTIDAD (TUTOR LEGAL)",
    "NOMBRE(S) (TUTOR LEGAL)",
    "APELLIDO(S) (TUTOR LEGAL)",
    "CORREO ELECTRONICO (TUTOR LEGAL)",
    "CELULAR (TUTOR LEGAL)",
    "TIPO DE TUTOR",
    "CARNET DE IDENTIDAD (PROFESOR)*",
    "NOMBRE(S) (PROFESOR)*",
    "APELLIDO(S) (PROFESOR)*",
    "CORREO ELECTRONICO (PROFESOR)*",
    "CELULAR (PROFESOR)*",
  ]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [errorCells, setErrorCells] = useState({});
  const location = useLocation();
  const navigation = useNavigate();

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.BASE_URL}plantilla.xlsx`;
    link.download = "Plantilla_Olimpistas.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertExcelDate = (excelDate) => {
    if (!excelDate) return "";
    if (
      typeof excelDate === "string" &&
      excelDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      return excelDate;
    }
    if (typeof excelDate === "number") {
      const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
      return date.toISOString().split("T")[0];
    }
    if (
      typeof excelDate === "string" &&
      excelDate.match(/^\d{2}\/\d{2}\/\d{4}$/)
    ) {
      const [day, month, year] = excelDate.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return excelDate;
  };

  const validateProfessorFields = (row, rowIndex) => {
    const professorFields = [
      { value: row[17], name: "CARNET DE IDENTIDAD (PROFESOR)" },
      { value: row[18], name: "NOMBRE(S) (PROFESOR)" },
      { value: row[19], name: "APELLIDO(S) (PROFESOR)" },
      { value: row[20], name: "CORREO ELECTRONICO (PROFESOR)" },
      { value: row[21], name: "CELULAR (PROFESOR)" },
    ];
    const hasSomeFields = professorFields.some(
      (f) =>
        f.value &&
        f.value.toString().trim() !== "" &&
        f.value.toString().trim() !== "-"
    );
    const hasAllFields = professorFields.every(
      (f) =>
        f.value &&
        f.value.toString().trim() !== "" &&
        f.value.toString().trim() !== "-"
    );
    if (hasSomeFields && !hasAllFields) {
      const missingFields = professorFields
        .filter(
          (f) =>
            !f.value ||
            f.value.toString().trim() === "" ||
            f.value.toString().trim() === "-"
        )
        .map((f) => f.name);
      return {
        error: `Fila ${
          rowIndex + 2
        }: Los campos de PROFESOR deben estar todos completos o todos vacíos. Faltan: ${missingFields.join(
          ", "
        )}`,
        cells: professorFields.map((_, i) => `${rowIndex}-${17 + i}`),
      };
    }
    if (hasAllFields) {
      const errors = [];
      const cells = [];
      if (!professorFields[0].value.toString().match(/^[a-zA-Z0-9]{6,12}$/)) {
        errors.push(
          `CARNET DE IDENTIDAD (PROFESOR) debe tener entre 6 y 12 caracteres alfanuméricos`
        );
        cells.push(`${rowIndex}-17`);
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !professorFields[3].value ||
        !emailRegex.test(professorFields[3].value.toString())
      ) {
        errors.push(`CORREO ELECTRONICO (PROFESOR) no es válido`);
        cells.push(`${rowIndex}-20`);
      }
      if (
        !professorFields[4].value ||
        !professorFields[4].value.toString().match(/^\d{8}$/)
      ) {
        errors.push(`CELULAR (PROFESOR) debe tener exactamente 8 dígitos`);
        cells.push(`${rowIndex}-21`);
      }
      if (errors.length > 0) {
        return {
          error: `Fila ${rowIndex + 2}: ${errors.join("; ")}`,
          cells: cells,
        };
      }
    }
    return null;
  };

  const validateData = (data) => {
    const errors = [];
    const cellErrors = {};
    data.forEach((row, rowIndex) => {
      const requiredFields = [
        { index: 0, name: "CARNET DE IDENTIDAD (OLIMPISTA)" },
        { index: 1, name: "NOMBRE(S) (OLIMPISTA)" },
        { index: 2, name: "APELLIDO(S) (OLIMPISTA)" },
        { index: 5, name: "DEPARTAMENTO (OLIMPISTA)" },
        { index: 6, name: "MUNICIPIO (OLIMPISTA)" },
        { index: 7, name: "COLEGIO (OLIMPISTA)" },
        { index: 12, name: "NOMBRE(S) (TUTOR LEGAL)" },
        { index: 13, name: "APELLIDO(S) (TUTOR LEGAL)" },
      ];
      requiredFields.forEach((field) => {
        if (!row[field.index] || row[field.index].toString().trim() === "") {
          errors.push(`Fila ${rowIndex + 2}: ${field.name} es requerido`);
          cellErrors[`${rowIndex}-${field.index}`] = true;
        }
      });
      const ciOlimpista = row[0]?.toString().trim();
      if (!ciOlimpista || !ciOlimpista.match(/^[a-zA-Z0-9]{6,12}$/)) {
        errors.push(
          `Fila ${
            rowIndex + 2
          }: CARNET DE IDENTIDAD (OLIMPISTA) debe tener entre 6 y 12 caracteres alfanuméricos`
        );
        cellErrors[`${rowIndex}-0`] = true;
      }
      const ciTutor = row[11]?.toString().trim();
      if (!ciTutor || !ciTutor.match(/^[a-zA-Z0-9]{6,12}$/)) {
        errors.push(
          `Fila ${
            rowIndex + 2
          }: CARNET DE IDENTIDAD (TUTOR LEGAL) debe tener entre 6 y 12 caracteres alfanuméricos`
        );
        cellErrors[`${rowIndex}-11`] = true;
      }
      const ciProfesor = row[17]?.toString().trim();
      if (
        ciProfesor &&
        ciProfesor !== "-" &&
        !ciProfesor.match(/^[a-zA-Z0-9]{6,12}$/)
      ) {
        errors.push(
          `Fila ${
            rowIndex + 2
          }: CARNET DE IDENTIDAD (PROFESOR) debe tener entre 6 y 12 caracteres alfanuméricos`
        );
        cellErrors[`${rowIndex}-17`] = true;
      }
      if (!row[3] || !row[3].toString().match(/^\d{4}-\d{2}-\d{2}$/)) {
        errors.push(
          `Fila ${
            rowIndex + 2
          }: FECHA DE NACIMIENTO (OLIMPISTA) debe estar en formato DD/MM/YYYY en el Excel`
        );
        cellErrors[`${rowIndex}-3`] = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!row[4] || !emailRegex.test(row[4].toString())) {
        errors.push(
          `Fila ${rowIndex + 2}: CORREO ELECTRONICO (OLIMPISTA) no es válido`
        );
        cellErrors[`${rowIndex}-4`] = true;
      }
      if (!row[14] || !emailRegex.test(row[14].toString())) {
        errors.push(
          `Fila ${rowIndex + 2}: CORREO ELECTRONICO (TUTOR LEGAL) no es válido`
        );
        cellErrors[`${rowIndex}-14`] = true;
      }
      if (row[20] && row[20] !== "-" && !emailRegex.test(row[20].toString())) {
        errors.push(
          `Fila ${rowIndex + 2}: CORREO ELECTRONICO (PROFESOR) no es válido`
        );
        cellErrors[`${rowIndex}-20`] = true;
      }
      if (!row[15] || !row[15].toString().match(/^\d{8}$/)) {
        errors.push(
          `Fila ${
            rowIndex + 2
          }: CELULAR (TUTOR LEGAL) debe tener exactamente 8 dígitos`
        );
        cellErrors[`${rowIndex}-15`] = true;
      }
      if (row[21] && row[21] !== "-" && !row[21].toString().match(/^\d{8}$/)) {
        errors.push(
          `Fila ${
            rowIndex + 2
          }: CELULAR (PROFESOR) debe tener exactamente 8 dígitos`
        );
        cellErrors[`${rowIndex}-21`] = true;
      }
      if (row[16]) {
        const tipoTutor = row[16].toString().toUpperCase().trim();
        if (
          tipoTutor.match(/^(MAMA\/PAPA|MAMÁ\/PAPÁ|MAMA\/PAPÁ|MAMÁ\/PAPA)$/i)
        ) {
          row[16] = "MAMÁ/PAPÁ";
        } else if (tipoTutor.match(/^(PAPA|PAPÁ|MAMA|MAMÁ)$/)) {
          row[16] = tipoTutor.replace("PAPA", "PAPÁ").replace("MAMA", "MAMÁ");
        } else if (tipoTutor.match(/^(TUTOR|TUTOR LEGAL|LEGAL)$/)) {
          row[16] = "TUTOR LEGAL";
        } else if (
          !["PAPÁ", "MAMÁ", "TUTOR LEGAL", "MAMÁ/PAPÁ"].includes(tipoTutor)
        ) {
          errors.push(
            `Fila ${
              rowIndex + 2
            }: TIPO DE TUTOR debe ser PAPÁ, MAMÁ, MAMÁ/PAPÁ o TUTOR LEGAL`
          );
          cellErrors[`${rowIndex}-16`] = true;
        }
      } else {
        errors.push(`Fila ${rowIndex + 2}: TIPO DE TUTOR es requerido`);
        cellErrors[`${rowIndex}-16`] = true;
      }
      if (!row[8]) {
        errors.push(`Fila ${rowIndex + 2}: CURSO (OLIMPISTA) es requerido`);
        cellErrors[`${rowIndex}-8`] = true;
      }
      if (!row[9]) {
        errors.push(`Fila ${rowIndex + 2}: AREA es requerida`);
        cellErrors[`${rowIndex}-9`] = true;
      }
      if (!row[10]) {
        errors.push(`Fila ${rowIndex + 2}: CATEGORIA es requerida`);
        cellErrors[`${rowIndex}-10`] = true;
      }
      const professorError = validateProfessorFields(row, rowIndex);
      if (professorError) {
        errors.push(professorError.error);
        professorError.cells.forEach((cell) => {
          cellErrors[cell] = true;
        });
      }
    });
    setErrorCells(cellErrors);
    return errors;
  };

  const getCellClassName = (rowIndex, cellIndex, cellValue) => {
    if (errorCells[`${rowIndex}-${cellIndex}`]) {
      return "error-cell";
    }
    if (cellIndex >= 17 && cellIndex <= 21) {
      if (!cellValue || cellValue === "-") return "optional-empty";
      return "optional-filled";
    }
    if (!cellValue && cellIndex < 17) return "empty-cell";
    return "";
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setSuccess("");
    setData([]);
    setValidationErrors([]);
    setErrorCells({});
    setIsLoading(true);
    try {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error("Solo se permiten archivos Excel (.xlsx, .xls)");
      }
      const workbook = XLSX.read(await file.arrayBuffer());
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
        defval: "",
        blankrows: false,
      });
      const filteredData = jsonData.filter((row) =>
        row.some((cell) => cell !== "")
      );
      if (filteredData.length === 0) {
        throw new Error("El archivo no contiene datos válidos");
      }
      const normalizedData = filteredData.map((row) => {
        const rowData = Array(22).fill("");
        row.forEach((cell, i) => {
          if (i < 22) {
            rowData[i] =
              i === 3
                ? convertExcelDate(cell)
                : cell !== null && cell !== undefined
                ? typeof cell === "string"
                  ? cell.trim()
                  : cell.toString()
                : "";
          }
        });
        return rowData;
      });
      const dbValidation = await validateExcelData(normalizedData);
      const dbErrors = dbValidation.errors || [];
      const frontendErrors = validateData(normalizedData);
      const allErrors = [...dbErrors, ...frontendErrors];
      setData(normalizedData);
      setFileName(file.name);
      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
        setError(
          `Se encontraron ${allErrors.length} errores de validación. Revise los campos marcados en rojo.`
        );
        const fieldToColumnMap = {
          "CARNET DE IDENTIDAD (OLIMPISTA)": 0,
          "NOMBRE(S) (OLIMPISTA)": 1,
          "APELLIDO(S) (OLIMPISTA)": 2,
          "FECHA DE NACIMIENTO (OLIMPISTA)": 3,
          "CORREO ELECTRONICO (OLIMPISTA)": 4,
          "DEPARTAMENTO (OLIMPISTA)": 5,
          "MUNICIPIO (OLIMPISTA)": 6,
          "COLEGIO (OLIMPISTA)": 7,
          "CURSO (OLIMPISTA)": 8,
          AREA: 9,
          CATEGORIA: 10,
          "CARNET DE IDENTIDAD (TUTOR LEGAL)": 11,
          "NOMBRE(S) (TUTOR LEGAL)": 12,
          "APELLIDO(S) (TUTOR LEGAL)": 13,
          "CORREO ELECTRONICO (TUTOR LEGAL)": 14,
          "CELULAR (TUTOR LEGAL)": 15,
          "TIPO DE TUTOR": 16,
          "CARNET DE IDENTIDAD (PROFESOR)*": 17,
          "NOMBRE(S) (PROFESOR)*": 18,
          "APELLIDO(S) (PROFESOR)*": 19,
          "CORREO ELECTRONICO (PROFESOR)*": 20,
          "CELULAR (PROFESOR)*": 21,
        };
        const newErrorCells = {};
        allErrors.forEach((error) => {
          const rowMatch = error.match(/Fila (\d+):/);
          if (rowMatch) {
            const row = parseInt(rowMatch[1]) - 2;
            for (const [field, colIndex] of Object.entries(fieldToColumnMap)) {
              if (error.includes(field)) {
                newErrorCells[`${row}-${colIndex}`] = true;
                break;
              }
            }
            if (
              error.includes("El área") ||
              error.includes("no está disponible para el área")
            ) {
              newErrorCells[`${row}-9`] = true;
            }
            if (
              error.includes("La categoría") ||
              error.includes("no está disponible para el área")
            ) {
              newErrorCells[`${row}-10`] = true;
            }
            if (error.includes("PROFESOR")) {
              if (error.includes("deben estar todos completos")) {
                for (let i = 17; i <= 21; i++) {
                  newErrorCells[`${row}-${i}`] = true;
                }
              }
            }
          }
        });
        setErrorCells(newErrorCells);
      } else {
        setSuccess(
          "Archivo cargado correctamente. Revise los datos antes de registrar."
        );
      }
    } catch (err) {
      console.error("Error procesando archivo:", err);
      setError(err.message || "Error al procesar el archivo");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (data.length === 0) {
      swal("Error", "No hay datos para registrar", "error");
      return;
    }
    setIsLoading(true);
    try {
      const responsibleData = {
        Nombre: sessionStorage.getItem("NombreResponsible"),
        Apellido: sessionStorage.getItem("ApellidoResponsible"),
        Tipo_Tutor: sessionStorage.getItem("TipoTutorResponsible"),
        Numero_Celular: sessionStorage.getItem("NumeroResponsible"),
        Email: sessionStorage.getItem("EmailResponsible"),
        Ci: sessionStorage.getItem("CiResponsible"),
      };

      const response = await registerFromExcel(
        responsibleData,
        data,
        JSON.parse(sessionStorage.getItem("OlympicData")).idOlimpiada
      );

      if (response.success) {
        // Guardar el ID del tutor en sessionStorage
        sessionStorage.setItem(
          "tutorInscripcionId",
          response.data.tutor_responsable_id
        );

        // Limpiar solo los datos temporales, manteniendo el ID del tutor
        const camposAConservar = {
          tutorInscripcionId: response.data.tutor_responsable_id,
        };
        sessionStorage.clear();
        sessionStorage.setItem(
          "tutorInscripcionId",
          camposAConservar.tutorInscripcionId
        );

        // Mostrar confirmación y redirigir
        await swal({
          title: "¡Registro exitoso!",
          text: response.message,
          icon: "success",
        });

        // Redirigir a ListRegistered con el estado necesario
        navigation("/register/listRegistered", {
          state: {
            freshRegistration: true,
            tutorData: {
              id: response.data.tutor_responsable_id,
              nombre: responsibleData.Nombre,
              apellido: responsibleData.Apellido,
            },
          },
        });
      } else {
        throw new Error(response.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      swal({
        title: "Error",
        text: error.message || "Error al registrar las inscripciones",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavLink to={"/register/responsible"}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
      <h1 className="title-register">Registro Olimpiadas O! Sansi 2025</h1>

      <div className="excel-container">
        <div className="excel-header">
          <h1>Inscribir Olimpistas Mediante Archivo Excel</h1>
          <div className="download-section">
            <p className="instructions">
              *Para evitar inconvenientes con el formato y la información del
              archivo .xlsx, descargue la plantilla*
              <br />
              *Los campos marcados con (*) son opcionales, pero si se completa
              uno deben completarse todos*
            </p>
            <button onClick={downloadTemplate} className="action-btn">
              Descargar Plantilla
            </button>
          </div>
        </div>
        <div className="upload-section">
          <h2>Sube tu archivo en formato .xlsx</h2>
          <div className="file-input-container">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              id="excel-upload"
              className="file-input"
              disabled={isLoading}
            />
            <label htmlFor="excel-upload" className="action-btn file-label">
              {isLoading ? "Procesando..." : "Seleccionar Archivo"}
            </label>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <h3>Errores de validación:</h3>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="data-section-excel">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={getCellClassName(
                            rowIndex,
                            cellIndex,
                            cell
                          )}
                        >
                          {cell ||
                            (cellIndex >= 17 && cellIndex <= 21 ? "-" : "⚠")}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="empty-table-message"
                    >
                      No hay datos cargados. Seleccione un archivo Excel para
                      visualizar los datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {data.length > 0 && validationErrors.length === 0 && (
            <div className="action-buttons-excel">
              <button
                className="action-btn register-btn"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrar Olimpistas"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterExcel;
