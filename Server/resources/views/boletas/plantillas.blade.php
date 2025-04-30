<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Boleta de Pago</title>
</head>
<body>
    <h1>Boleta de Pago</h1>
    <p>Nombre del Tutor: {{ $tutor->persona->nombre }} {{ $tutor->persona->apellido }}</p>
    <p>Fecha de Emisión: {{ $fecha }}</p>
    <p>Total de Estudiantes: {{ $inscripciones->count() }}</p>
    <p>Monto Total: Bs {{ $montoTotal }}</p>
</body>
</html>
