import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./RegisterExcel.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { validateExcelData, registerFromExcel } from "../../../api/inscriptionExcel.api";
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
        "CARNET DE IDENTIDAD (PROFESOR)*",
        "NOMBRE(S) (PROFESOR)*",
        "APELLIDO(S) (PROFESOR)*",
        "CORREO ELECTRONICO (PROFESOR)*",
        "CELULAR (PROFESOR)*"
    ]);

    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [errorCells, setErrorCells] = useState({});
    const location = useLocation();

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
        
        if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return excelDate;
        }
        
        if (typeof excelDate === 'number') {
            const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
            return date.toISOString().split('T')[0];
        }
        
        if (typeof excelDate === 'string' && excelDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = excelDate.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        return excelDate;
    };

    const validateProfessorFields = (row, rowIndex) => {
        const professorFields = [row[17], row[18], row[19], row[20], row[21]];
        const hasSomeFields = professorFields.some(field => field && field.trim() !== "");
        const hasAllFields = professorFields.every(field => field && field.trim() !== "");
        
        if (hasSomeFields && !hasAllFields) {
            return `Fila ${rowIndex + 2}: Los campos de PROFESOR deben estar todos completos o todos vacíos`;
        }
        return null;
    };

    const validateData = (data) => {
        const errors = [];
        const cellErrors = {};
        
        data.forEach((row, rowIndex) => {
            // Validar CI Olimpista (columna 0)
            if (!row[0] || !row[0].toString().match(/^[a-zA-Z0-9]{6,12}$/)) {
                errors.push(`Fila ${rowIndex + 2}: CARNET DE IDENTIDAD (OLIMPISTA) debe tener entre 6 y 12 caracteres alfanuméricos`);
                cellErrors[`${rowIndex}-0`] = true;
            }
            
            // Validar CI Tutor Legal (columna 11)
            if (!row[11] || !row[11].toString().match(/^[a-zA-Z0-9]{6,12}$/)) {
                errors.push(`Fila ${rowIndex + 2}: CARNET DE IDENTIDAD (TUTOR LEGAL) debe tener entre 6 y 12 caracteres alfanuméricos`);
                cellErrors[`${rowIndex}-11`] = true;
            }
            
            // Validar CI Profesor (columna 17) solo si existe
            if (row[17] && !row[17].toString().match(/^[a-zA-Z0-9]{6,12}$/)) {
                errors.push(`Fila ${rowIndex + 2}: CARNET DE IDENTIDAD (PROFESOR) debe tener entre 6 y 12 caracteres alfanuméricos`);
                cellErrors[`${rowIndex}-17`] = true;
            }
            
            // Validar Fecha de Nacimiento (columna 3)
            if (!row[3] || !row[3].toString().match(/^\d{4}-\d{2}-\d{2}$/)) {
                errors.push(`Fila ${rowIndex + 2}: FECHA DE NACIMIENTO (OLIMPISTA) debe estar en formato DD/MM/YYYY en el Excel`);
                cellErrors[`${rowIndex}-3`] = true;
            }
            
            // Validar Correos (columnas 4, 14, 20)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!row[4] || !emailRegex.test(row[4].toString())) {
                errors.push(`Fila ${rowIndex + 2}: CORREO ELECTRONICO (OLIMPISTA) no es válido`);
                cellErrors[`${rowIndex}-4`] = true;
            }
            if (!row[14] || !emailRegex.test(row[14].toString())) {
                errors.push(`Fila ${rowIndex + 2}: CORREO ELECTRONICO (TUTOR LEGAL) no es válido`);
                cellErrors[`${rowIndex}-14`] = true;
            }
            if (row[20] && !emailRegex.test(row[20].toString())) {
                errors.push(`Fila ${rowIndex + 2}: CORREO ELECTRONICO (PROFESOR) no es válido`);
                cellErrors[`${rowIndex}-20`] = true;
            }
            
            // Validar Celulares (columnas 15, 21)
            if (!row[15] || !row[15].toString().match(/^\d{8}$/)) {
                errors.push(`Fila ${rowIndex + 2}: CELULAR (TUTOR LEGAL) debe tener exactamente 8 dígitos`);
                cellErrors[`${rowIndex}-15`] = true;
            }
            if (row[21] && !row[21].toString().match(/^\d{8}$/)) {
                errors.push(`Fila ${rowIndex + 2}: CELULAR (PROFESOR) debe tener exactamente 8 dígitos`);
                cellErrors[`${rowIndex}-21`] = true;
            }
            
            // Validar y normalizar Tipo Tutor (columna 16)
            if (row[16]) {
                const tipoTutor = row[16].toString().toUpperCase().trim();
                
                if (tipoTutor.match(/^(MAMA\/PAPA|MAMÁ\/PAPÁ|MAMA\/PAPÁ|MAMÁ\/PAPA)$/i)) {
                    row[16] = "MAMÁ/PAPÁ";
                } 
                else if (tipoTutor.match(/^(PAPA|PAPÁ|MAMA|MAMÁ)$/)) {
                    row[16] = tipoTutor.replace("PAPA", "PAPÁ").replace("MAMA", "MAMÁ");
                } else if (tipoTutor.match(/^(TUTOR|TUTOR LEGAL|LEGAL)$/)) {
                    row[16] = "TUTOR LEGAL";
                } else if (!["PAPÁ", "MAMÁ", "TUTOR LEGAL", "MAMÁ/PAPÁ"].includes(tipoTutor)) {
                    errors.push(`Fila ${rowIndex + 2}: TIPO DE TUTOR debe ser PAPÁ, MAMÁ, MAMÁ/PAPÁ o TUTOR LEGAL`);
                    cellErrors[`${rowIndex}-16`] = true;
                }
            } else {
                errors.push(`Fila ${rowIndex + 2}: TIPO DE TUTOR es requerido`);
                cellErrors[`${rowIndex}-16`] = true;
            }
            
            // Validar y normalizar Curso (columna 8)
            if (!row[8]) {
                errors.push(`Fila ${rowIndex + 2}: CURSO (OLIMPISTA) es requerido`);
                cellErrors[`${rowIndex}-8`] = true;
            }

            // Validar Área (columna 9)
            if (!row[9]) {
                errors.push(`Fila ${rowIndex + 2}: AREA es requerida`);
                cellErrors[`${rowIndex}-9`] = true;
            }

            // Validar Categoría (columna 10)
            if (!row[10]) {
                errors.push(`Fila ${rowIndex + 2}: CATEGORIA es requerida`);
                cellErrors[`${rowIndex}-10`] = true;
            }
            
            // Validar campos de PROFESOR (deben estar todos llenos o todos vacíos)
            const professorError = validateProfessorFields(row, rowIndex);
            if (professorError) {
                errors.push(professorError);
                // Marcar todos los campos de profesor como error
                for (let i = 17; i <= 21; i++) {
                    if (row[i]) {
                        cellErrors[`${rowIndex}-${i}`] = true;
                    }
                }
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
            if (!cellValue) return "optional-empty";
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
    
            // 1. Validar contra la base de datos primero
            const dbValidation = await validateExcelData(normalizedData);
            const dbErrors = dbValidation.errors || [];
    
            // 2. Validar el resto de campos
            const frontendErrors = validateData(normalizedData);
            
            // Combinar todos los errores
            const allErrors = [...dbErrors, ...frontendErrors];
            
            setData(normalizedData);
            setFileName(file.name);
    
            if (allErrors.length > 0) {
                setValidationErrors(allErrors);
                setError(`Se encontraron ${allErrors.length} errores de validación. Revise los campos marcados en rojo.`);
                
                // Marcar celdas con error - VERSIÓN CORREGIDA
                const newErrorCells = {};
                allErrors.forEach(error => {
                    // Extraer número de fila
                    const rowMatch = error.match(/Fila (\d+):/);
                    if (!rowMatch) return;
                    const row = parseInt(rowMatch[1]) - 2;
    
                    // 1. Manejar errores de ÁREA
                    if (error.includes('AREA es requerida') || 
                        error.includes('El área') || 
                        error.includes('Área no especificada')) {
                        newErrorCells[`${row}-9`] = true;
                    }
    
                    // 2. Manejar errores de CATEGORÍA
                    if (error.includes('CATEGORIA es requerida') || 
                        error.includes('La categoría') || 
                        error.includes('Categoría no especificada')) {
                        newErrorCells[`${row}-10`] = true;
                    }
    
                    // 3. Manejar errores de combinación
                    if (error.includes('no está disponible para el área')) {
                        newErrorCells[`${row}-9`] = true;
                        newErrorCells[`${row}-10`] = true;
                    }
    
                    // 4. Manejar otros errores (CI, correos, etc.)
                    const columnMatch = error.match(/Fila \d+: (.*?):/);
                    if (columnMatch) {
                        const column = columnMatch[1].trim();
                        const colIndex = headers.findIndex(h => h.includes(column));
                        if (colIndex >= 0) {
                            newErrorCells[`${row}-${colIndex}`] = true;
                        }
                    }
                });
                setErrorCells(newErrorCells);
            } else {
                setSuccess("Archivo cargado correctamente. Revise los datos antes de registrar.");
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

            const response = await registerFromExcel(responsibleData, data);

            if (response.success) {
                swal({
                    title: "Éxito",
                    text: response.message,
                    icon: "success",
                });
                setData([]);
                setFileName("");
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
                                    del archivo .xlsx, descargue la plantilla*<br />
                                    *Los campos marcados con (*) son opcionales, pero si se completa uno deben completarse todos*
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

                        {validationErrors.length > 0 && (
                            <div className="validation-errors">
                                <h3>Errores de validación:</h3>
                                <ul>
                                    {validationErrors.slice(0, 10).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                    {validationErrors.length > 10 && (
                                        <li>...y {validationErrors.length - 10} errores más</li>
                                    )}
                                </ul>
                            </div>
                        )}

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
                                                        <td 
                                                            key={cellIndex}
                                                            className={getCellClassName(rowIndex, cellIndex, cell)}
                                                        >
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

                            {data.length > 0 && validationErrors.length === 0 && (
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