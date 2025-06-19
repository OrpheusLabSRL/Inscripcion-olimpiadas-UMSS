// pdfgenerator.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Función para convertir números a palabras
const numeroAPalabras = (num) => {
  const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const especiales = ['once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  
  num = Math.floor(num);
  if (num === 0) return 'cero';
  if (num < 10) return unidades[num];
  if (num < 20) return especiales[num - 11] || decenas[1] + (num % 10 ? ' y ' + unidades[num % 10] : '');
  if (num < 100) return decenas[Math.floor(num / 10)] + (num % 10 ? ' y ' + unidades[num % 10] : '');
  if (num === 100) return 'cien';
  if (num < 1000) return centenas[Math.floor(num / 100)] + (num % 100 ? ' ' + numeroAPalabras(num % 100) : '');
  return 'mil'; // Simplificación para números mayores
};

// Función para dibujar texto con saltos de línea
const drawTextWithLineBreaks = (page, text, x, y, maxWidth, size, font, color = rgb(0, 0, 0)) => {
  if (!text) return 0;
  
  const words = text.split(' ');
  let line = '';
  let lines = [];
  
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);
    
    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  
  if (line) lines.push(line);
  
  lines.forEach((lineText, i) => {
    page.drawText(lineText, {
      x,
      y: y - (i * (size + 2)),
      size,
      font,
      color,
    });
  });
  
  return lines.length;
};

// Función para dibujar la tabla resumida (para más de 20 estudiantes)
const drawSummaryTable = (page, boletaData, startY, columnWidths, smallFontSize, font, fontBold) => {
  const { width } = page.getSize();
  const tableStartX = (width - columnWidths.reduce((a, b) => a + b, 0)) / 2;
  const headerHeight = 20;
  const rowHeight = 20;
  const rowPadding = 5;
  
  // Dibujar encabezado
  page.drawRectangle({
    x: tableStartX,
    y: startY - headerHeight,
    width: columnWidths.reduce((a, b) => a + b, 0),
    height: headerHeight,
    color: rgb(0.2, 0.4, 0.8),
  });

  // Texto del encabezado
  let offsetX = tableStartX;
  ["Cantidad", "Detalle", "P. Unitario", "Total"].forEach((header, i) => {
    page.drawText(header, {
      x: offsetX + rowPadding,
      y: startY - headerHeight + rowPadding + smallFontSize/2 -2,
      size: smallFontSize,
      font: fontBold,
      color: rgb(1, 1, 1),
      maxWidth: columnWidths[i] - rowPadding * 2,
      lineHeight: smallFontSize,
    });
    offsetX += columnWidths[i];
  });
  
  // Dibujar fila de datos
  const costo = parseFloat(boletaData.area.costo_unitario) || 0;
  const total = costo * boletaData.total.cantidad_estudiantes;
  
  // Fondo de fila
  page.drawRectangle({
    x: tableStartX,
    y: startY - headerHeight - rowHeight,
    width: columnWidths.reduce((a, b) => a + b, 0),
    height: rowHeight,
    color: rgb(0.97, 0.97, 0.97),
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 0.4,
  });
  
  // Contenido de la fila
  // Cantidad
  page.drawText(boletaData.total.cantidad_estudiantes.toString(), {
    x: tableStartX + rowPadding,
    y: startY - headerHeight - rowHeight + rowPadding + smallFontSize/2 -2,
    size: smallFontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Detalle
  page.drawText("Inscripción a Olimpíadas", {
    x: tableStartX + columnWidths[0] + rowPadding,
    y: startY - headerHeight - rowHeight + rowPadding + smallFontSize/2 -2,
    size: smallFontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  // P. Unitario
  page.drawText(`Bs ${costo.toFixed(2)}`, {
    x: tableStartX + columnWidths[0] + columnWidths[1] + rowPadding,
    y: startY - headerHeight - rowHeight + rowPadding + smallFontSize/2 -2,
    size: smallFontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Total
  page.drawText(`Bs ${total.toFixed(2)}`, {
    x: tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2] + rowPadding,
    y: startY - headerHeight - rowHeight + rowPadding + smallFontSize/2 -2,
    size: smallFontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  return startY - headerHeight - rowHeight - 10;
};

// Función para dibujar la tabla de estudiantes con paginación (para 20 o menos estudiantes)
const drawStudentTable = (pdfDoc, boletaData, startY, columnWidths, smallFontSize, font, fontBold) => {
  const pages = [pdfDoc.getPages()[0]];
  const margin = 50;
  const { width } = pages[0].getSize();
  const tableStartX = (width - columnWidths.reduce((a, b) => a + b, 0)) / 2;
  
  // Encabezados de la tabla
  const headerHeight = 20;
  const rowPadding = 5;
  const minRowHeight = 20;
  const lineHeight = smallFontSize + 2;
  
  let currentPageIndex = 0;
  let currentY = startY;
  let remainingStudents = [...boletaData.olimpistas];
  
  while (remainingStudents.length > 0) {
    const page = pages[currentPageIndex];
    
    // Dibujar encabezado solo si hay espacio
    if (currentY - headerHeight - minRowHeight > margin) {
      // Fondo del encabezado
      page.drawRectangle({
        x: tableStartX,
        y: currentY - headerHeight,
        width: columnWidths.reduce((a, b) => a + b, 0),
        height: headerHeight,
        color: rgb(0.2, 0.4, 0.8),
      });

      // Texto del encabezado
      let offsetX = tableStartX;
      ["CI Estudiante", "Nombre del Estudiante", "Área", "Precio"].forEach((header, i) => {
        page.drawText(header, {
          x: offsetX + rowPadding,
          y: currentY - headerHeight + rowPadding + smallFontSize/2 -2,
          size: smallFontSize,
          font: fontBold,
          color: rgb(1, 1, 1),
          maxWidth: columnWidths[i] - rowPadding * 2,
          lineHeight: smallFontSize,
        });
        offsetX += columnWidths[i];
      });
      
      currentY -= headerHeight;
    } else {
      // No hay espacio, crear nueva página
      const newPage = pdfDoc.addPage([612, 900]);
      pages.push(newPage);
      currentPageIndex++;
      currentY = newPage.getSize().height - margin;
      continue;
    }
    
    // Procesar estudiantes que caben en la página actual
    const processedIndices = [];
    const costo = parseFloat(boletaData.area.costo_unitario) || 0;
    
    for (let i = 0; i < remainingStudents.length; i++) {
      const olimpista = remainingStudents[i];
      const nombre = olimpista.nombre_completo || '';
      const area = boletaData.area.nombre || '';
      
      // Calcular altura necesaria para la fila
      const nombreWidth = columnWidths[1] - rowPadding * 2;
      const areaWidth = columnWidths[2] - rowPadding * 2;
      
      const nombreLines = Math.ceil(
        font.widthOfTextAtSize(nombre, smallFontSize) / nombreWidth
      );
      
      const areaLines = Math.ceil(
        font.widthOfTextAtSize(area, smallFontSize) / areaWidth
      );
      
      const maxLines = Math.max(nombreLines, areaLines, 1);
      const rowHeight = Math.max(minRowHeight, maxLines * lineHeight);
      
      // Verificar si hay espacio para esta fila
      if (currentY - rowHeight < margin) {
        // No hay espacio, crear nueva página
        const newPage = pdfDoc.addPage([612, 900]);
        pages.push(newPage);
        currentPageIndex++;
        currentY = newPage.getSize().height - margin;
        break;
      }
      
      // Dibujar fila
      const rowY = currentY - rowHeight;
      const bgColor = i % 2 === 0 ? rgb(0.97, 0.97, 0.97) : rgb(1, 1, 1);
      
      // Dibujar fondo de fila
      let x = tableStartX;
      columnWidths.forEach((w) => {
        page.drawRectangle({
          x,
          y: rowY,
          width: w,
          height: rowHeight,
          color: bgColor,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 0.4,
        });
        x += w;
      });
      
      // Dibujar contenido de la fila
      // CI Estudiante
      page.drawText(olimpista.ci || '', {
        x: tableStartX + rowPadding,
        y: rowY + rowHeight / 2 + smallFontSize / 3 -7,
        size: smallFontSize,
        font,
        color: rgb(0, 0, 0),
      });
      
      // Nombre del Estudiante
      drawTextWithLineBreaks(
        page,
        nombre,
        tableStartX + columnWidths[0] + rowPadding,
        rowY + rowHeight / 2 + smallFontSize / 2 -7,
        columnWidths[1] - rowPadding * 2,
        smallFontSize,
        font
      );
      
      // Área
      drawTextWithLineBreaks(
        page,
        area,
        tableStartX + columnWidths[0] + columnWidths[1] + rowPadding,
        rowY + rowHeight / 2 + smallFontSize / 2 - 7,
        columnWidths[2] - rowPadding * 2,
        smallFontSize,
        font
      );
      
      // Precio
      page.drawText(`Bs ${costo.toFixed(2)}`, {
        x: tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2] + rowPadding,
        y: rowY + rowHeight / 2 + smallFontSize / 3 - 7, 
        size: smallFontSize,
        font,
        color: rgb(0, 0, 0),
      });
      
      currentY -= rowHeight;
      processedIndices.push(i);
    }
    
    // Eliminar estudiantes procesados
    remainingStudents = remainingStudents.filter((_, index) => !processedIndices.includes(index));
  }
  
  return { pages, finalY: currentY };
};

// Función principal para generar el PDF
export const generatePdfBoleta = async (boletaData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 900]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Configuración de tamaños
  const smallFontSize = 10;
  const normalFontSize = 12;
  const titleFontSize = 14;
  const headerFontSize = 16;
  const margin = 50;
  let currentY = height - margin;

  // Función para texto centrado
  const drawCenteredText = (text, size, yOffset, useBold = true) => {
    const textFont = useBold ? fontBold : font;
    const textWidth = textFont.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: currentY - yOffset,
      size,
      font: textFont,
      color: rgb(0, 0, 0),
    });
  };

  // Encabezado
  drawCenteredText(boletaData.universidad, titleFontSize, 0);
  drawCenteredText(boletaData.facultad, normalFontSize, 25);
  drawCenteredText(boletaData.secretaria, normalFontSize, 45);

  // Número de boleta
  page.drawText(`Nº ${String(boletaData.inscripcion.codigo_boleta).padStart(4, '0')}`, {
    x: width - 120,
    y: currentY - 70,
    size: titleFontSize,
    font: fontBold,
    color: rgb(1, 0, 0),
  });

  // Título principal
  drawCenteredText('ORDEN DE PAGO', headerFontSize, 90);

  // Datos del tutor
  currentY -= 140;
  page.drawText(`Señor(es): ${boletaData.tutor.nombre_completo}`, {
    x: margin,
    y: currentY,
    size: normalFontSize,
    font: font,
  });
  page.drawText(`NIT/CI: ${boletaData.tutor.ci}`, {
    x: margin,
    y: currentY - 18,
    size: normalFontSize,
    font: font,
  });
  page.drawText(`Teléfono: ${boletaData.tutor.telefono}`, {
    x: margin,
    y: currentY - 36,
    size: normalFontSize,
    font: font,
  });
  page.drawText(`Código de Inscripción: ${boletaData.inscripcion.codigo}`, {
    x: margin,
    y: currentY - 54,
    size: normalFontSize,
    font: font,
  });

  // Sección de detalle
  currentY -= 92;
  drawCenteredText('DETALLE DE INSCRIPCIONES', normalFontSize, 0);

  // Configuración de la tabla
  let finalY;
  
  if (boletaData.total.cantidad_estudiantes > 20) {
    // Usar tabla resumida
    const summaryColumnWidths = [80, 250, 100, 80];
    finalY = drawSummaryTable(
      page,
      boletaData,
      currentY - 30,
      summaryColumnWidths,
      smallFontSize,
      font,
      fontBold
    );
  } else {
    // Usar tabla detallada
    const studentColumnWidths = [100, 200, 120, 80];
    const result = drawStudentTable(
      pdfDoc,
      boletaData,
      currentY - 30,
      studentColumnWidths,
      smallFontSize,
      font,
      fontBold
    );
    finalY = result.finalY;
  }

  // Sección de totales (en la última página)
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  const totalsStartY = Math.min(finalY, lastPage.getSize().height - margin) - 40;
  
  lastPage.drawText(`Total Estudiantes: ${boletaData.total.cantidad_estudiantes}`, {
    x: width - 220,
    y: totalsStartY,
    size: normalFontSize,
    font: fontBold,
  });

  lastPage.drawText(`Total a Pagar: Bs ${boletaData.total.monto.toFixed(2)}`, {
    x: width - 220,
    y: totalsStartY - 18,
    size: normalFontSize,
    font: fontBold,
  });

  // Monto en palabras
  const montoEnPalabras = numeroAPalabras(boletaData.total.monto) + ' Bolivianos';
  drawTextWithLineBreaks(
    lastPage,
    `Son: ${montoEnPalabras}`,
    margin,
    totalsStartY - 36,
    width - (margin * 2),
    normalFontSize,
    font
  );

  // Pie de página
  const today = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const fechaFormateada = today.toLocaleDateString('es-ES', options);

  lastPage.drawText(`Cochabamba, ${fechaFormateada}`, {
    x: width - 220,
    y: totalsStartY - 72,
    size: normalFontSize,
    font: font,
  });

  // Descargar el PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `boleta_pago_${boletaData.inscripcion.codigo}.pdf`;
  link.click();
};