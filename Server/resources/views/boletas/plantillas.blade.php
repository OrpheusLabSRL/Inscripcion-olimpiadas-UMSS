<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Orden de Pago</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            position: relative;
        }

        h1,
        h3 {
            text-align: center;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .titulo-boleta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 20px;
        }

        .titulo {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            width: 100%;
        }

        .codigo-boleta {
            font-size: 18px;
            font-weight: bold;
            color: red;
            position: absolute;
            right: 0;
        }

        .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .info p {
            margin-bottom: 5px;
            font-size: 16px
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 10px;
            border: 1px solid #007BFF;
            border-radius: 8px;
            overflow: hidden;
        }

        thead th {
            background-color: #007BFF;
            color: white;
            font-weight: bold;
            padding: 10px;
        }

        th,
        td {
            padding: 8px;
            font-size: 13px;
            text-align: center;
            border: 1px solid #007BFF;
            background-color: rgb(0, 123, 255, 0.1);
        }

        .total {
            text-align: right;
            margin-top: 10px;
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
    <div class="header">
        UNIVERSIDAD MAYOR DE SAN SIMÓN <br>
        FACULTAD DE CIENCIAS Y TECNOLOGÍA <br>
        SECRETARÍA ADMINISTRATIVA
    </div>

    <!-- Marca de agua -->
    <div class="watermark">
        <img src="{{ public_path('images/marca_agua.png') }}" alt="Marca de Agua">
    </div>

    <div class="titulo-boleta">
        <div class="codigo-boleta">
            N°: 00{{ $boleta->codigoBoleta }}
        </div>
        <h2 class="titulo">Orden de pago</h2>
    </div>

    <div class="info">
        <p><strong>Señor(es):</strong> {{ $tutor->persona->nombre }} {{ $tutor->persona->apellido }}</p>
        <p><strong>NIT/CI:</strong> {{ $tutor->persona->carnetIdentidad }}</p>
        <p><strong>Código de Inscripción:</strong> {{ $inscripciones->first()->codigoInscripcion }}</p>

      
    </div>

    <h3>Detalle de Inscripciones</h3>
    <table>
        <thead>
            <tr>
                <th>Carnet de Identidad <br> del estudiante</th>
                <th>Nombre del Estudiante</th>
                <th>Área</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($inscripciones as $inscripcion)
                <tr>

                    <td>{{ $inscripcion->olimpista->persona->carnetIdentidad }}</td>
                    <td>{{ $inscripcion->olimpista->persona->nombre }} {{ $inscripcion->olimpista->persona->apellido }}
                    </td>
                    <td>{{ $inscripcion->OlimpiadaAreaCategoria->area->nombreArea }}</td>
                    <td>Bs{{ $inscripcion->OlimpiadaAreaCategoria->costo}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        <p><strong>Son:</strong> {{ $montoTotal }} Bolivianos</p>

        <p><strong>Total de Estudiantes:</strong> {{ $inscripciones->count() }}</p>
        <p>Cochabamba, {{ \Carbon\Carbon::parse($fecha)->locale('es')->isoFormat('D [de] MMMM [de] YYYY') }}</p>
    </div>
</body>

</html>
