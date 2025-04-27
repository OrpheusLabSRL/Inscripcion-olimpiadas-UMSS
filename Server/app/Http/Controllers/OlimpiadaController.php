<?php

namespace App\Http\Controllers;

use App\Models\Olimpiada;
use Illuminate\Http\Request;

class OlimpiadaController extends Controller
{
    // API - Listar todas las olimpiadas
    public function mostrarOlimpiada()
    {
        $olimpiadas = Olimpiada::all();
        return response()->json(['data' => $olimpiadas]);
    }

    // API - Crear nueva olimpiada
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreOlimpiada' => 'required|string|max:100|unique:olimpiadas,nombreOlimpiada',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimpiada' => 'required|date',
            'fechaFinOlimpiada' => 'required|date|after:fechaInicioOlimpiada',
        ]);

        $validated['estadoOlimpiada'] = false;
        $validated['idUsuario'] = 1;

        $olimpiada = Olimpiada::create($validated);

        return response()->json([
            'message' => 'Olimpiada creada exitosamente',
            'data' => $olimpiada
        ], 201);
    }

    // API - Actualizar olimpiada
    public function update(Request $request, $id)
    {
        $olimpiada = Olimpiada::findOrFail($id);

        $request->validate([
            'nombreOlimpiada' => 'required|string|max:100|unique:olimpiadas,nombreOlimpiada,' . $id . ',idOlimpiada',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimpiada' => 'required|date',
            'fechaFinOlimpiada' => 'required|date|after:fechaInicioOlimpiada',
            'estadoOlimpiada' => 'required|boolean',
        ]);

        $olimpiada->update($request->all());

        return response()->json([
            'message' => 'Olimpiada actualizada correctamente',
            'data' => $olimpiada
        ]);
    }

    // API - Eliminar olimpiada
    public function destroy($id)
    {
        $olimpiada = Olimpiada::findOrFail($id);
        $olimpiada->delete();

        return response()->json([
            'message' => 'Olimpiada eliminada correctamente'
        ]);
    }
}
