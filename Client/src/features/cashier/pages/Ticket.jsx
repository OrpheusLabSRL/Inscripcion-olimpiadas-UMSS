import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketDataRequest } from '../../../api/Ticket.api.js';
import { generateTicketPdf } from '../utils/pdfGenerator';
import '../Styles/Ticket.css';

export const Ticket = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchAndGeneratePdf = async () => {
      if (!id) {
        setError('No se proporcionó un ID de boleta.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getTicketDataRequest(id);
        console.log("Datos recibidos de la API:", res.data);
        const url = await generateTicketPdf(res.data);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error al generar el PDF:", err);
        setError('No se pudo generar la boleta. Verifique que el código sea correcto.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndGeneratePdf();

    // Clean up the object URL on component unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pdf-loading">
        <div className="loading-content">
          <h2>Generando Boleta...</h2>
          <p>Por favor espere mientras preparamos su documento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-loading">
        <div className="loading-content">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          className="pdf-viewer"
          title="PDF Boleta"
        />
      )}
    </div>
  );
}; 