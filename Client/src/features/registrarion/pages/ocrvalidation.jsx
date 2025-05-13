import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import "../Styles/ocrvalidation.css";

export const OcrValidation = () => {
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOcrResult("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, seleccione un archivo para procesar.");
      return;
    }

    // Placeholder for OCR processing logic
    // You can integrate OCR API or library here
    // For now, simulate OCR result
    setOcrResult("Resultado simulado de OCR para el archivo: " + file.name);
  };

  const handleBack = () => {
    navigate("/register");
  };

  return (
    <div className="ocrvalidation-container">
      <h1>Validación OCR</h1>
      <p>Suba una imagen o documento para validar mediante OCR.</p>
      <form onSubmit={handleSubmit} className="ocrvalidation-form">
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        <PrimaryButton type="submit" value="Procesar OCR" />
      </form>
      {ocrResult && (
        <div className="ocr-result">
          <h2>Resultado OCR:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
      <button className="back-button" onClick={handleBack}>Volver</button>
    </div>
  );
};
