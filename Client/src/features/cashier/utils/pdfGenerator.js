import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Función para convertir números a letras (replicando la función PHP)
function numeroALetras(numero) {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    
    const entero = Math.floor(numero);
    
    if (entero <= 9) {
        return unidades[entero];
    } else if (entero <= 99) {
        if (entero >= 10 && entero <= 19) {
            const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
            return especiales[entero - 10];
        } else {
            const dec = Math.floor(entero / 10);
            const uni = entero % 10;
            if (uni === 0) {
                return decenas[dec];
            } else {
                return decenas[dec] + ' Y ' + unidades[uni];
            }
        }
    } else if (entero <= 999) {
        const cen = Math.floor(entero / 100);
        const resto = entero % 100;
        
        if (resto === 0) {
            return centenas[cen];
        } else {
            return centenas[cen] + ' ' + numeroALetras(resto);
        }
    }
    
    return "NUMERO FUERA DE RANGO";
}

export async function generateTicketPdf(ticketData) {
    console.log("Generando PDF con datos:", ticketData);
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Usar fuente monoespaciada similar a Courier
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

    let y = height - 40;

    const drawText = (text, x, yPos, options = {}) => {
        page.drawText(text, {
            x,
            y: yPos,
            font: options.font || font,
            size: options.size || 12,
            color: options.color || rgb(0, 0, 0),
        });
        return (options.size || 12) + (options.spacing || 2);
    };

    const drawCenteredText = (text, yPos, options = {}) => {
        const textWidth = font.widthOfTextAtSize(text, options.size || 12);
        const x = (width - textWidth) / 2;
        page.drawText(text, {
            x,
            y: yPos,
            font: options.font || font,
            size: options.size || 12,
            color: options.color || rgb(0, 0, 0),
        });
        return (options.size || 12) + (options.spacing || 2);
    };

    const drawRightAlignedText = (text, yPos, options = {}) => {
        const textWidth = font.widthOfTextAtSize(text, options.size || 12);
        const x = width - textWidth - 50; // 50px margin from right
        page.drawText(text, {
            x,
            y: yPos,
            font: options.font || font,
            size: options.size || 12,
            color: options.color || rgb(0, 0, 0),
        });
        return (options.size || 12) + (options.spacing || 2);
    };

    // Encabezado centrado
    y -= drawCenteredText('UNIVERSIDAD MAYOR DE SAN SIMON', y);
    y -= drawCenteredText('DIRECCION ADMINISTRATIVA Y FINANCIERA', y);
    y -= 20; // Ln(5) equivalente
    y -= drawCenteredText('RECIBO DE CAJA', y);
    y -= 20; // Ln(5) equivalente

    // Datos de la boleta alineados a la derecha
    y -= drawRightAlignedText(`Nro. Control: ${ticketData.numeroControl}`, y);
    const fechaEmision = new Date(ticketData.fechaEmision).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-');
    y -= drawRightAlignedText(`Fecha: ${fechaEmision}`, y);
    y -= drawRightAlignedText('Usuario: HTORREZ', y);
    y -= 20; // Ln(5) equivalente

    // Datos del cliente
    const tutorNombre = ticketData.tutor && ticketData.tutor.persona 
        ? `${ticketData.tutor.persona.nombre} ${ticketData.tutor.persona.apellido}`
        : 'No disponible';
    y -= drawText(`Recibi de: ${tutorNombre}`, 50, y);
    y -= drawText('Por concepto de:', 50, y);
    y -= drawText('DECANATO - OLIMPIADA EN CIENCIAS SANSI O! SANSI', 50, y);
    y -= 20; // Ln(5) equivalente

    // Monto en texto y número
    const montoTotal = parseFloat(ticketData.montoTotal).toFixed(2);
    const montoTexto = numeroALetras(parseInt(montoTotal));
    y -= drawText(`La suma de: ${montoTexto}`, 50, y);
    y -= drawRightAlignedText(`Total: Bs ${montoTotal}`, y);
    y -= 20; // Ln(5) equivalente

    // Aclaraciones y códigos
    y -= drawText(`Aclaracion: OF ${ticketData.codigoBoleta}`, 50, y);
    y -= 20; // Ln(5) equivalente
    y -= drawText('Documento: 1023219029', 50, y);
    y -= drawText('Codigo:', 50, y);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
} 