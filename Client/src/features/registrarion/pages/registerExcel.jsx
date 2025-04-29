import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './RegisterExcel.css';

const RegisterExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([
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
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [cellErrors, setCellErrors] = useState({});
  const [tutorAdjustments, setTutorAdjustments] = useState([]);

  // FUNCIÓN CORREGIDA PARA DESCARGAR PLANTILLA
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = process.env.PUBLIC_URL + '/plantilla.xlsx';
    link.download = 'Plantilla_Olimpistas.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateCarnet = (value) => {
    if (!value) return false;
    const strValue = String(value).trim();
    return /^[a-zA-Z0-9]{6,12}$/.test(strValue);
  };

  const validateEmail = (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateDate = (date) => {
    if (!date) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    return /^\d{8}$/.test(String(phone).trim());
  };

  const validateOptionalProfessorFields = (row) => {
    const professorFields = row.slice(17, 22);
    const allEmpty = professorFields.every(field => !field || String(field).trim() === '');
    const allFilled = professorFields.every(field => field && String(field).trim() !== '');
    return allEmpty || allFilled;
  };

  const normalizeTutorType = (value) => {
    if (!value) return '';
    const normalized = String(value).trim().toLowerCase();
    const parentVariations = ['mama', 'mamá', 'papa', 'papá', 'madre', 'padre'];
    if (parentVariations.some(v => normalized.includes(v))) return 'MAMÁ/PAPÁ';
    const tutorVariations = ['tutor', 'profesor', 'representante', 'legal'];
    if (tutorVariations.some(v => normalized.includes(v))) return 'TUTOR LEGAL';
    return value.toUpperCase();
  };

  // FUNCIÓN CORREGIDA PARA LEER DESDE FILA 2
  const handleFileUpload = (e) => {
    setError('');
    setSuccess('');
    setData([]);
    setValidationErrors([]);
    setCellErrors({});
    setTutorAdjustments([]);

    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Por favor, sube únicamente archivos Excel (.xlsx o .xls)');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // LEER DESDE FILA 2 (range: 1)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          range: 1, // Esta línea hace que lea desde la fila 2
          defval: null
        });

        const filteredData = jsonData.filter(row => 
          row.some(cell => cell !== null && cell !== '')
        );

        if (filteredData.length > 0) {
          const errors = [];
          const newCellErrors = {};
          const tutorAdjustments = [];

          const cleanedData = filteredData.map((row, rowIndex) => {
            if (row.length > 16) {
              const originalValue = row[16] || '';
              const normalizedValue = normalizeTutorType(originalValue);
              
              if (normalizedValue !== originalValue) {
                tutorAdjustments.push({
                  row: rowIndex + 2,
                  original: originalValue,
                  normalized: normalizedValue
                });
                row[16] = normalizedValue;
              }
              
              if (!['MAMÁ/PAPÁ', 'TUTOR LEGAL'].includes(normalizedValue)) {
                errors.push({
                  type: 'invalid_tutor',
                  row: rowIndex + 2,
                  column: 17,
                  header: headers[16],
                  message: `Fila ${rowIndex + 2}, Columna 17 (${headers[16]}): Valor inválido (debe ser MAMÁ/PAPÁ o TUTOR LEGAL)`
                });
                newCellErrors[`${rowIndex}-16`] = true;
              }
            }

            return row.map(cell => cell === null ? '' : String(cell).trim());
          });

          // Resto de validaciones...
          setTutorAdjustments(tutorAdjustments);
          setData(cleanedData);
          setCellErrors(newCellErrors);

          if (errors.length > 0) {
            setValidationErrors(errors);
            setError('Se encontraron errores en el archivo');
          } else {
            setSuccess('Archivo procesado correctamente');
          }
        } else {
          setError('El archivo no contiene datos válidos');
        }
      } catch (err) {
        setError('Error al procesar el archivo');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getErrorMessage = (errorType) => {
    switch (errorType) {
      case 'invalid_carnet': return 'Carnet inválido (6-12 caracteres alfanuméricos)';
      case 'invalid_date': return 'Fecha inválida';
      case 'invalid_email': return 'Correo electrónico inválido';
      case 'invalid_phone': return 'Celular inválido (8 dígitos exactos)';
      case 'invalid_tutor': return 'Valor inválido (MAMÁ/PAPÁ o TUTOR LEGAL)';
      default: return 'Error de validación';
    }
  };

  const isProfessorField = (index) => index >= 17 && index <= 21;
  const isProfessorRowComplete = (row) => row.slice(17, 22).some(field => field);
  const getCellClass = (rowIndex, cellIndex, cellValue) => {
    const hasError = cellErrors[`${rowIndex}-${cellIndex}`];
    if (hasError) return 'error-cell';
    const isEmpty = !cellValue;
    if (isProfessorField(cellIndex)) {
      if (isEmpty) return 'optional-empty';
      return 'optional-filled';
    }
    return isEmpty ? 'empty-cell' : '';
  };

  return (
    <div className="app-background">
      <div className="excel-container">
        <div className="excel-header">
          <h1>Inscribir Olimpistas Mediante Archivo Excel</h1>
          <div className="download-section">
            <p className="instructions">*Para evitar inconvenientes con el formato y la información del archivo .xlsx, descargue la plantilla*</p>
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
            />
            <label htmlFor="excel-upload" className="action-btn file-label">
              Seleccionar Archivo
            </label>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {tutorAdjustments.length > 0 && (
          <div className="info-message">
            <h3>Ajustes realizados en la columna TIPO DE TUTOR:</h3>
            <ul>
              {tutorAdjustments.map((adj, i) => (
                <li key={i}>Fila {adj.row}: "{adj.original}" → "{adj.normalized}"</li>
              ))}
            </ul>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <h3>Errores de validación:</h3>
            <ul>
              {validationErrors.map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="data-section">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i}>
                      {header}
                      {isProfessorField(i) && <span className="optional-field"> (Opcional)</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={getCellClass(rowIndex, cellIndex, cell)}>
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {validationErrors.length === 0 && data.length > 0 && (
            <div className="action-buttons">
              <button className="action-btn register-btn">Registrar Olimpistas</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterExcel;