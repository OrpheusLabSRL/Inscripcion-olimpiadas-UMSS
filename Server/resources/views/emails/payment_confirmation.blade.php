<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirmación de Pago</title>
</head>
<body>
    <p>Estimado/a {{ $tutor->nombre ?? 'Tutor' }},</p>

    <p>Le informamos que el pago de la boleta ha sido confirmado exitosamente.</p>

    <p>Detalles de la boleta:</p>
    <ul>
        <li>Fecha de emisión: {{ $boleta->fechaEmision }}</li>
        <li>Monto total: Bs {{ number_format($boleta->montoTotal, 2) }}</li>
    </ul>

    <p>Gracias por su pago y confianza.</p>

    <p>Atentamente,<br>
    Universidad Mayor de San Simón</p>
</body>
</html>
