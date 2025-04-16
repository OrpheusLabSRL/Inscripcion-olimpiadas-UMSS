<?php

namespace App\Http\Controllers;

use App\Models\OlimpiadaArea;
use Illuminate\Http\Request;

class OlimpiadaAreaController extends Controller
{
    // Listar todas las relaciones Olimpiada - Área
    public function index()
    {
        $registros = OlimpiadaArea::with(['olimpiada', 'area'])->get();
        return response()->json($registros);
    }

    // Mostrar una relación específica
    public function show($id)
    {
        $registro = OlimpiadaArea::with(['olimpiada', 'area'])->findOrFail($id);
        return response()->json($registro);
    }

    // Crear una nueva relación
    public function store(Request $request)
    {
        $request->validate([
            'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
            'idArea' => 'required|exists:areas,idArea',
            'estadoOlimpiadaArea' => 'required|boolean',
        ]);

        $registro = OlimpiadaArea::create($request->all());

        return response()->json([
            'message' => 'Relación creada exitosamente',
            'data' => $registro,
        ], 201);
    }

    // Actualizar una relación existente
    public function update(Request $request, $id)
    {
        $registro = OlimpiadaArea::findOrFail($id);

        $request->validate([
            'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
            'idArea' => 'required|exists:areas,idArea',
            'estadoOlimpiadaArea' => 'required|boolean',
        ]);

        $registro->update($request->all());

        return response()->json([
            'message' => 'Relación actualizada exitosamente',
            'data' => $registro,
        ]);
    }

    // Eliminar una relación
    public function destroy($id)
    {
        $registro = OlimpiadaArea::findOrFail($id);
        $registro->delete();

        return response()->json([
            'message' => 'Relación eliminada correctamente'
        ]);
    }
}
