<?php

namespace App\Http\Controllers;

use App\Models\Grados;
use Illuminate\Http\Request;

class GradoController extends Controller
{
    // Listar todos los grados
    public function index()
    {
        $grados = Grados::all();
        return response()->json($grados);
    }

    // Obtener un grado por ID
    public function show($idGrado)
    {
        $grado = Grados::find($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->json($grado);
    }

    // Crear un nuevo grado
    public function store(Request $request)
    {
        $request->validate([
            'nombreGrado' => 'required|string|max:255',
        ]);

        $grado = Grados::create([
            'nombreGrado' => $request->nombreGrado,
        ]);

        return response()->json(['message' => 'Grado creado correctamente', 'data' => $grado], 201);
    }

    // Actualizar un grado existente
    public function update(Request $request, $idGrado)
    {
        $grado = Grados::find($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $request->validate([
            'nombreGrado' => 'required|string|max:255',
        ]);

        $grado->update([
            'nombreGrado' => $request->nombreGrado,
        ]);

        return response()->json(['message' => 'Grado actualizado correctamente', 'data' => $grado]);
    }

    // Eliminar un grado
    public function destroy($idGrado)
    {
        $grado = Grados::find($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $grado->delete();

        return response()->json(['message' => 'Grado eliminado correctamente']);
    }
}
