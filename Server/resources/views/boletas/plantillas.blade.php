<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Boleta de Pago</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            position: relative;
        }

        h1, h3 {
            text-align: center;
        }

        .info {
            margin-bottom: 20px;
        }

        .info p {
            margin: 3px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table, th, td {
            border: 1px solid black;
        }

        th, td {
            padding: 8px;
            font-size: 13px;
            text-align: left;
        }

        .total {
            text-align: right;
            margin-top: 10px;
        }

        .codigo-boleta {
            text-align: right;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        /* Marca de agua */
        .watermark {
            position: fixed;
            top: 35%;
            left: 20%;
            width: 60%;
            opacity: 0.06;
            z-index: -1;
        }

        .watermark img {
            width: 100%;
        }
    </style>
</head>
<body>

    <!-- Marca de agua -->
    <div class="watermark">
        <img src="{{ public_path('images/marca_agua.png') }}" alt="Marca de Agua">
    </div>

    <h1>Boleta de Pago</h1>

    <div class="codigo-boleta">
        Código de Boleta: {{ $boleta->codigoBoleta }}
    </div>

    <div class="info">
        <p><strong>Nombre del Tutor:</strong> {{ $tutor->persona->nombre }} {{ $tutor->persona->apellido }}</p>
        <p><strong>Fecha de Emisión:</strong> {{ $fecha }}</p>
    </div>

    <h3>Detalle de Inscripciones</h3>
    <table>
        <thead>
            <tr>
                <th>Nombre del Olimpista</th>
                <th>Carnet de Identidad</th>
                <th>Área</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($inscripciones as $inscripcion)
                <tr>
                    <td>{{ $inscripcion->olimpista->persona->nombre }} {{ $inscripcion->olimpista->persona->apellido }}</td>
                    <td>{{ $inscripcion->olimpista->persona->carnetIdentidad }}</td>
                    <td>{{ $inscripcion->OlimpiadaAreaCategoria->area->nombreArea }}</td>
                    <td>Bs {{ $inscripcion->OlimpiadaAreaCategoria->area->costoArea }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        <p><strong>Total a Pagar:</strong> Bs {{ $montoTotal }}</p>
        <p><strong>Total de Estudiantes:</strong> {{ $inscripciones->count() }}</p>
    </div>

</body>
</html>
