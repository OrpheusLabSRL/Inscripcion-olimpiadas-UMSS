import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./RegisterExcel.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  registerFromExcel,
  validateExcelData,
  getAvailableCombinations,
} from "../../../api/inscriptionExcel.api";
import swal from "sweetalert";

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
    "CARNET DE IDENTIDAD (PROFESOR)",
    "NOMBRE(S) (PROFESOR)",
    "APELLIDO(S) (PROFESOR)",
    "CORREO ELECTRONICO (PROFESOR)",
    "CELULAR (PROFESOR)",
  ]);

  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigation = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setValidationErrors([]);
    setIsLoading(true);

    try {
      // 1. Validar tipo de archivo
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error("Solo se permiten archivos Excel (.xlsx, .xls)");
      }

      // 2. Leer archivo (empezando desde fila 2)
      const workbook = XLSX.read(await file.arrayBuffer());
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convertir a JSON ignorando la primera fila (encabezados)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1, // Ignorar primera fila
        defval: "",
        blankrows: false,
      });

      // Filtrar filas vacías
      const filteredData = jsonData.filter((row) =>
        row.some((cell) => cell !== "")
      );

      if (filteredData.length === 0) {
        throw new Error(
          "El archivo no contiene datos después de la fila de encabezados"
        );
      }

      // Asegurar 22 columnas por fila
      const normalizedData = filteredData.map((row) => {
        const rowData = Array(22).fill("");
        row.forEach((cell, i) => i < 22 && (rowData[i] = cell));
        return rowData;
      });

      setData(normalizedData);
      setFileName(file.name);
      setSuccess(
        "Archivo cargado correctamente. Revise los datos antes de registrar."
      );
    } catch (err) {
      console.error("Error procesando archivo:", err);
      setError(err.message || "Error al procesar el archivo");
      setData([]); // Limpiar datos en caso de error
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

      const response = await registerFromExcel(responsibleData, data);

      if (response.data.success) {
        let successMsg = `Registro exitoso: ${response.data.data.olimpistas_registrados} olimpistas inscritos.`;

        if (response.data.data.errores?.length > 0) {
          successMsg += `\n\nErrores parciales:\n${response.data.data.errores
            .slice(0, 5)
            .join("\n")}`;
          if (response.data.data.errores.length > 5) {
            successMsg += `\n...y ${
              response.data.data.errores.length - 5
            } errores más`;
          }
        }

        swal({
          title: "Éxito",
          text: successMsg,
          icon: "success",
        }).then(() => {
          // Limpiar sessionStorage y redirigir
          sessionStorage.clear();
          navigation("/");
        });
      } else {
        throw new Error(response.data.message || "Error en el registro");
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
    <div className="app-container">
      <div className="main active">
        <Sidebar
          isOpen={true}
          setIsOpen={() => {}}
          admin={!location.pathname.startsWith("/admin") ? false : true}
        />

        <div className="content-area">
          <div className="excel-container">
            <div className="excel-header">
              <h1>Inscribir Olimpistas Mediante Archivo Excel</h1>
              <div className="download-section">
                <p className="instructions">
                  *Para evitar inconvenientes con el formato y la información
                  del archivo .xlsx, descargue la plantilla*
                </p>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `${process.env.PUBLIC_URL}/plantilla.xlsx`;
                    link.download = "Plantilla_Olimpistas.xlsx";
                    link.click();
                  }}
                  className="action-btn"
                >
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

            {/* Tabla siempre visible */}
            <div className="data-section">
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
                            <td key={cellIndex}>{cell || "-"}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={headers.length} className="empty-table-message">
                          No hay datos cargados. Seleccione un archivo Excel para visualizar los datos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data.length > 0 && (
                <div className="action-buttons">
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
      </div>
    </div>
  );
};

export default RegisterExcel;