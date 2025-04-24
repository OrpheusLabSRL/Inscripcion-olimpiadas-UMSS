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
    "MUNICIPIO/PROVINCIA (OLIMPISTA)",
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
    "TIPO DE TUTOR"
  ]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileUpload = (e) => {
    setError('');
    setSuccess('');
    setData([]);
    setValidationErrors([]);

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
        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellStyles: true });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Obtener datos incluyendo información de estilo
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          range: 1,
          defval: null,
          raw: false,
          cellStyles: true
        });

        // Filtrar solo filas que tengan datos reales (ignorar celdas solo con formato)
        const filteredData = jsonData.filter(row => 
          row.some((cell, index) => {
            const cellRef = XLSX.utils.encode_cell({ r: jsonData.indexOf(row) + 1, c: index });
            const cellInfo = worksheet[cellRef];
            // Considerar celda vacía solo si no tiene valor NI formato de validación
            return cell !== null && cell !== '' && (!cellInfo || !cellInfo.s || cellInfo.v !== undefined);
          })
        );

        if (filteredData.length > 0) {
          const errors = [];
          
          // Validar cada fila con datos
          filteredData.forEach((row, rowIndex) => {
            // Validar número de columnas
            if (row.length !== headers.length) {
              errors.push({
                type: 'columns',
                row: rowIndex + 2,
                expected: headers.length,
                actual: row.length
              });
              return;
            }

            // Validar campos vacíos
            row.forEach((cell, cellIndex) => {
              const cellRef = XLSX.utils.encode_cell({ r: jsonData.indexOf(row) + 1, c: cellIndex });
              const cellInfo = worksheet[cellRef];
              
              // Solo marcar error si la celda está realmente vacía (sin valor y sin formato de validación)
              if ((cell === null || cell === '') && (!cellInfo || !cellInfo.s || cellInfo.v === undefined)) {
                errors.push({
                  type: 'empty',
                  row: rowIndex + 2,
                  column: cellIndex + 1,
                  header: headers[cellIndex]
                });
              }
            });
          });

          if (errors.length > 0) {
            setValidationErrors(errors);
            setError('Se encontraron errores en el archivo');
          } else {
            // Limpiar datos para visualización
            const cleanedData = filteredData.map(row => 
              row.map(cell => {
                if (cell === null || cell === '') return '';
                return String(cell).trim();
              })
            );
            setData(cleanedData);
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

  const downloadTemplate = () => {
    const templateData = [
      headers,
      ...Array(3).fill(Array(headers.length).fill(''))
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Plantilla_Olimpistas.xlsx");
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

        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <h3>Errores de validación:</h3>
            <ul>
              {validationErrors.map((err, index) => (
                <li key={index}>
                  {err.type === 'columns'
                    ? `Fila ${err.row}: Tiene ${err.actual} columnas (se esperaban ${err.expected})`
                    : `Fila ${err.row}, Columna ${err.column} (${err.header}): Falta información`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="data-section">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={cell === '' ? 'empty-cell' : ''}>
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="action-buttons">
            <button className="action-btn register-btn">Registrar Olimpistas</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterExcel;