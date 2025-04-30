<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Agregar Área</h1>

    <form action="{{ route('area.agregar') }}" method="POST">
        @csrf

        <label for="idOlimpiada">Seleccionar Olimpiada:</label>
        <select id="idOlimpiada" name="idOlimpiada" required>
            <option value="">-- Selecciona una Olimpiada --</option>
            @foreach($olimpiada as $o)
                <option value="{{ $o->idOlimpiada }}">{{ $o->nombreOlimpiada }} - Versión {{ $o->version }}</option>
            @endforeach
        </select>
        <br>

        <label for="nombreArea">Nombre del Área:</label>
        <input type="text" id="nombreArea" name="nombreArea" required>
        <br>

        <label for="descripcionArea">Descripción:</label>
        <textarea id="descripcionArea" name="descripcionArea"></textarea>
        <br>

        <label for="costoArea">Costo:</label>
        <input type="number" id="costoArea" name="costoArea" min="1" required>
        <br>

        <button type="submit">Guardar Área</button>
    </form>

    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Olimpiada</th>
                <th>Estado</th>

            </tr>
        </thead>
        <tbody>
            @foreach($area as $a)
                <tr>
                    <td>{{ $a->idArea }}</td>
                    <td>{{ $a->nombreArea }}</td>
                    <td>{{ $a->descripcionArea ?? 'Sin descripción' }}</td>
                    <td>{{ $a->costoArea }}</td>
                    <td>{{ $a->olimpiada->nombreOlimpiada}}</td>
                    <td>{{ $a->estadoArea ? 'Activo' : 'Inactivo' }}</td>
                    
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>