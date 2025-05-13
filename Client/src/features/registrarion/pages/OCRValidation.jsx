import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import "../Styles/OCRValidation.css";

export const OCRValidation = () => {
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
        <div className="ocr-result-panel" style={{marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f9f9f9", maxHeight: "300px", overflowY: "auto"}}>
          <h2>Texto extraído:</h2>
          <div className="ocr-result-text" style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
            {ocrResult}
          </div>
        </div>
      )}
      <button className="back-button" onClick={handleBack} style={{marginTop: "20px"}}>Volver</button>
    </div>
  );
};
