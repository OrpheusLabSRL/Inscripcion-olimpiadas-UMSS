<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <h1>Pruebas</h1>

        <h1>Agregar Olimpiada</h1>

        <form action="{{ route('olimpiada.agregar') }}" method="POST">
            @csrf

            <label for="nombreOlimpiada">Nombre de la Olimpiada:</label>
            <input type="text" id="nombreOlimpiada" name="nombreOlimpiada" value="{{ old('nombreOlimpiada') }}" required>
            <br>

            <label for="version">Versión:</label>
            <input type="number" id="version" name="version" value="{{ old('version') }}" min="1" required>
            <br>

            <label for="fechaInicioOlimp">Fecha de Inicio:</label>
            <input type="date" id="fechaInicioOlimp" name="fechaInicioOlimp" value="{{ old('fechaInicioOlimp') }}"
                required>
            <br>

            <label for="fechaFinOlimp">Fecha de Fin:</label>
            <input type="date" id="fechaFinOlimp" name="fechaFinOlimp" value="{{ old('fechaFinOlimp') }}" required>
            <br>
            
            <button type="submit">Guardar</button>
        </form>

        <h1>Lista de Olimpiadas</h1>



        <table border="1">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Versión</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
            </tr>
            @foreach ($olimpiadas as $olimpiada)
                <tr>
                    <td>{{ $olimpiada->idOlimpiada }}</td>
                    <td>{{ $olimpiada->nombreOlimpiada }}</td>
                    <td>{{ $olimpiada->version }}</td>
                    <td>{{ $olimpiada->fechaInicioOlimp }}</td>
                    <td>{{ $olimpiada->fechaFinOlimp }}</td>
                </tr>
            @endforeach
        </table>

</body>

</html>
