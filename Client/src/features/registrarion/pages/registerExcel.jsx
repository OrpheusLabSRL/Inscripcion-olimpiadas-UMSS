import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './RegisterExcel.css';

const RegisterExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const cleanCellContent = (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/\bAsk\s*(AI|IA|Al)\b/gi, '').trim() || '-';
  };

  const handleFileUpload = (e) => {
    setError('');
    setSuccess('');
    setData([]);
    setHeaders([]);
    
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.match(/\.(xlsx)$/i)) {
      setError('Por favor, sube únicamente archivos Excel (.xlsx)');
      return;
    }
    
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const sheetName = workbook.SheetNames.find(name => 
          name.trim().toLowerCase() === 'formulario'
        );

        if (!sheetName) {
          setError('No se encontró la hoja "Formulario"');
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          raw: false,
          defval: ''
        });
        
        if (jsonData.length > 0) {
          const cleanedData = jsonData
            .map(row => row.map(cleanCellContent))
            .filter(row => row.some(cell => cell !== '-')); 
          if (cleanedData.length > 0) {
            setHeaders(cleanedData[0]);
            setData(cleanedData.slice(1));
            setSuccess('Archivo procesado correctamente');
          } else {
            setError('No se encontraron datos válidos después de la limpieza');
          }
        } else {
          setError('La hoja está vacía');
        }
      } catch (err) {
        setError('Error al procesar el archivo');
        console.error(err);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="excel-upload-container">
      <h1>Cargar Archivo Excel</h1>
      
      <div className="file-upload-section">
        <label>
          Selecciona un archivo Excel (.xlsx) con hoja "Formulario":
        </label>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="file-input"
        />
        <p className="file-helper-text">
          Solo archivos .xlsx con hoja llamada "Formulario"
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {fileName && !error && (
        <div className="file-info">
          <p><span>Archivo:</span> {fileName}</p>
        </div>
      )}
      
      {data.length > 0 && (
        <div className="data-table-container">
          <h2>Datos de la hoja "Formulario"</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{cleanCellContent(header)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cleanCellContent(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <p>{data.length} filas mostradas</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterExcel;