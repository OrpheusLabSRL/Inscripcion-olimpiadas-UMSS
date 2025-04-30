import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./RegisterExcel.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { registerFromExcel } from "../../../api/inscriptionExcel.api";
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
        "CELULAR (PROFESOR)"
    ]);

    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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

    // Función para convertir fecha de DD/MM/YYYY a YYYY-MM-DD
    const convertExcelDate = (excelDate) => {
        if (!excelDate) return "";
        
        // Si ya está en formato correcto, retornar tal cual
        if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return excelDate;
        }
        
        // Si es número (formato Excel), convertirlo
        if (typeof excelDate === 'number') {
            const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
            return date.toISOString().split('T')[0];
        }
        
        // Si es string con formato DD/MM/YYYY
        if (typeof excelDate === 'string' && excelDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = excelDate.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        return excelDate; // Devolver original si no coincide con ningún formato
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError("");
        setSuccess("");
        setData([]);
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

            // Normalizar datos convirtiendo fechas
            const normalizedData = filteredData.map((row) => {
                const rowData = Array(22).fill("");
                row.forEach((cell, i) => {
                    if (i < 22) {
                        // Convertir fecha si es la columna de fecha de nacimiento (índice 3)
                        rowData[i] = (i === 3) ? convertExcelDate(cell) : 
                                    (cell !== null && cell !== undefined ? 
                                    (typeof cell === 'string' ? cell.trim() : cell.toString()) : "");
                    }
                });
                
                // Limpiar datos de profesor si no hay CI
                if (rowData[17] === "") {
                    for (let i = 17; i <= 21; i++) {
                        rowData[i] = "";
                    }
                }
                
                return rowData;
            });

            setData(normalizedData);
            setFileName(file.name);
            setSuccess("Archivo cargado correctamente. Revise los datos antes de registrar.");

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

            const response = await registerFromExcel(responsibleData, data);

            if (response.success) {
                let successMsg = `Registro exitoso: ${response.data.olimpistas_registrados} olimpistas inscritos.`;

                if (response.data.errores?.length > 0) {
                    successMsg += `\n\nErrores en ${response.data.errores.length} registros:\n`;
                    response.data.errores.forEach((error, index) => {
                        if (index < 5) {
                            successMsg += `• ${error}\n`;
                        }
                    });
                    if (response.data.errores.length > 5) {
                        successMsg += `\n...y ${response.data.errores.length - 5} errores más.`;
                    }
                }

                swal({
                    title: response.data.errores?.length > 0 ? "Registro parcial" : "Éxito",
                    text: successMsg,
                    icon: response.data.errores?.length > 0 ? "warning" : "success",
                });
                
                // No redirigir, solo limpiar si fue éxito total
                if (response.data.errores?.length === 0) {
                    setData([]);
                    setFileName("");
                }

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
                                    onClick={downloadTemplate}
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
                                                        <td key={cellIndex}>
                                                            {cell || (cellIndex >= 17 && cellIndex <= 21 ? "-" : "⚠")}
                                                        </td>
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