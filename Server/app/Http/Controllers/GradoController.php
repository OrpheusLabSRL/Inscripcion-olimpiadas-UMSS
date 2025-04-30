<?php

namespace App\Http\Controllers;

use App\Models\Grado;
use Illuminate\Http\Request;

class GradoController extends Controller
{
    // Obtener todos los grados
    public function index()
    {
        $grados = Grado::all();
        return response()->json($grados);
    }

    // Obtener un grado por su ID
    public function show($idGrado)
    {
        $grado = Grado::find($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->json($grado);
    }

    // Crear un nuevo grado
    public function store(Request $request)
    {
        $request->validate([
            'numeroGrado' => 'required|integer',
            'nivel' => 'required|string|max:10',
            'estadoGrado' => 'required|boolean'
        ]);

        $grado = Grado::create([
            'numeroGrado' => $request->numeroGrado,
            'nivel' => $request->nivel,
            'estadoGrado' => $request->estadoGrado
        ]);

        return response()->json(['message' => 'Grado creado correctamente', 'data' => $grado], 201);
    }

    // Actualizar un grado existente
    public function update(Request $request, $idGrado)
    {
        $grado = Grado::find($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $request->validate([
            'numeroGrado' => 'required|integer',
            'nivel' => 'required|string|max:10',
            'estadoGrado' => 'required|boolean'
        ]);

        $grado->update([
            'numeroGrado' => $request->numeroGrado,
            'nivel' => $request->nivel,
            'estadoGrado' => $request->estadoGrado
        ]);

        return response()->json(['message' => 'Grado actualizado correctamente', 'data' => $grado]);
    }

    // Eliminar un grado
    public function destroy($idGrado)
    {
        $grado = Grado::find($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $grado->delete();

        return response()->json(['message' => 'Grado eliminado correctamente']);
    }
}
