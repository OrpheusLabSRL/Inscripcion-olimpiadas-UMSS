<?php

namespace App\Http\Controllers;

use App\Models\CategoriaGrado;
use Illuminate\Http\Request;

class CategoriaGradoController extends Controller
{
    // Obtener todas las relaciones
    public function index()
    {
        return response()->json(CategoriaGrado::with(['categoria', 'grado'])->get());
    }

    // Crear una nueva relación
    public function store(Request $request)
    {
        $request->validate([
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'idGrado' => 'required|exists:grado,idGrado',
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        $relacion = CategoriaGrado::create($request->only([
            'idCategoria',
            'idGrado',
            'estadoCategoriaGrado'
        ]));

        return response()->json([
            'message' => 'Relación creada correctamente',
            'data' => $relacion
        ], 201);
    }

    // Actualizar una relación existente
    public function update(Request $request, $id)
    {
        $relacion = CategoriaGrado::findOrFail($id);

        $request->validate([
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'idGrado' => 'required|exists:grado,idGrado',
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        $relacion->update($request->only([
            'idCategoria',
            'idGrado',
            'estadoCategoriaGrado'
        ]));

        return response()->json([
            'message' => 'Relación actualizada',
            'data' => $relacion
        ]);
    }

    // Eliminar una relación
    public function destroy($id)
    {
        $relacion = CategoriaGrado::findOrFail($id);
        $relacion->delete();

        return response()->json(['message' => 'Relación eliminada']);
    }
}
