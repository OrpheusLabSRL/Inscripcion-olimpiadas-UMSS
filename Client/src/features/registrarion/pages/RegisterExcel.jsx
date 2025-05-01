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
    const navigation = useNavigate();

    // Lista de áreas válidas con formato estándar
    const validAreas = [
        "Astronomía y Astrofísica",
        "Biología",
        "Física",
        "Informática",
        "Matemáticas",
        "Química",
        "Robótica"
    ];

    // Lista de categorías válidas con formato estándar
    const validCategories = [
        "3P", "4P", "5P", "6P", "1S", "2S", 
        "Guacamayo", "Builders P", "Lego P", "Guanaco", 
        "Londra", "Bufeo", "Jucumari", "Puma", 
        "Primer Nivel", "Segundo Nivel", "Tercer Nivel", 
        "Cuarto Nivel", "Quinto Nivel", "Sexto Nivel",
        "2S", "3S", "4S", "5S", "6S", "Lego S", "Builders S"
    ];

    // Lista de cursos válidos con formato estándar
    const validCourses = [
        "1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", 
        "5º Primaria", "6º Primaria", "1º Secundaria", "2º Secundaria", 
        "3º Secundaria", "4º Secundaria", "5º Secundaria", "6º Secundaria"
    ];

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

    const normalizeCourse = (input) => {
        if (!input) return null;
        
        // Eliminar espacios y convertir a minúsculas
        const cleanInput = input.toString().trim().toLowerCase();
        
        // Buscar coincidencia exacta ignorando mayúsculas y espacios
        const exactMatch = validCourses.find(course => 
            course.toLowerCase() === cleanInput
        );
        if (exactMatch) return exactMatch;
        
        // Buscar coincidencia flexible (con o sin º, con o sin espacio después del número)
        const flexibleMatch = validCourses.find(course => {
            const courseLower = course.toLowerCase();
            const inputWithoutSymbol = cleanInput.replace(/º|°/g, '').replace(/([0-9])([a-z])/, '$1 $2');
            return courseLower === inputWithoutSymbol || 
                   courseLower.replace('º', '') === cleanInput.replace(/º|°/g, '');
        });
        
        return flexibleMatch || null;
    };

    const normalizeArea = (input) => {
        if (!input) return null;
        
        const normalized = input.toString()
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/ y /g, " y ")
            .trim();
        
        const matchedArea = validAreas.find(area => 
            area.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized
        );
        
        return matchedArea || null;
    };

    const normalizeCategory = (input) => {
        if (!input) return null;
        
        const normalized = input.toString()
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim();
        
        const matchedCategory = validCategories.find(category => 
            category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized
        );
        
        return matchedCategory || null;
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
            
            // Validar y normalizar Área (columna 9)
            if (row[9]) {
                const normalizedArea = normalizeArea(row[9]);
                if (normalizedArea) {
                    row[9] = normalizedArea; // Asignar el formato estándar
                } else {
                    errors.push(`Fila ${rowIndex + 2}: AREA no válida. Las áreas válidas son: ${validAreas.join(", ")}`);
                    cellErrors[`${rowIndex}-9`] = true;
                }
            } else {
                errors.push(`Fila ${rowIndex + 2}: AREA es requerida`);
                cellErrors[`${rowIndex}-9`] = true;
            }
            
            // Validar y normalizar Categoría (columna 10)
            if (row[10]) {
                const normalizedCategory = normalizeCategory(row[10]);
                if (normalizedCategory) {
                    row[10] = normalizedCategory; // Asignar el formato estándar
                } else {
                    errors.push(`Fila ${rowIndex + 2}: CATEGORIA no válida. Las categorías válidas son: ${validCategories.join(", ")}`);
                    cellErrors[`${rowIndex}-10`] = true;
                }
            } else {
                errors.push(`Fila ${rowIndex + 2}: CATEGORIA es requerida`);
                cellErrors[`${rowIndex}-10`] = true;
            }
            
            // Validar y normalizar Curso (columna 8)
            if (row[8]) {
                const normalizedCourse = normalizeCourse(row[8]);
                if (normalizedCourse) {
                    row[8] = normalizedCourse; // Asignar el formato estándar
                } else {
                    errors.push(`Fila ${rowIndex + 2}: CURSO (OLIMPISTA) no válido. Los cursos válidos son: ${validCourses.join(", ")}`);
                    cellErrors[`${rowIndex}-8`] = true;
                }
            } else {
                errors.push(`Fila ${rowIndex + 2}: CURSO (OLIMPISTA) es requerido`);
                cellErrors[`${rowIndex}-8`] = true;
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
                        rowData[i] = (i === 3) ? convertExcelDate(cell) : 
                                    (cell !== null && cell !== undefined ? 
                                    (typeof cell === 'string' ? cell.trim() : cell.toString()) : "");
                    }
                });
                
                return rowData;
            });

            const errors = validateData(normalizedData);
            setData(normalizedData);
            setFileName(file.name);
            
            if (errors.length > 0) {
                setValidationErrors(errors);
                setError(`Se encontraron ${errors.length} errores de validación. Revise los campos marcados en rojo.`);
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