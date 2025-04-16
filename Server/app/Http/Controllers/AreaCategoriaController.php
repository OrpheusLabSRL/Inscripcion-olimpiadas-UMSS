<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AreaCategoriaController extends Controller
{
    // Obtener todas las relaciones área-categoría
    public function index()
    {
        $relaciones = DB::table('area_categoria')->get();
        return response()->json($relaciones);
    }

    // Crear una nueva relación
    public function store(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:areas,idArea',
            'categoria_id' => 'required|exists:categorias,idCategoria',
            'estadoAreaCategoria' => 'required|boolean',
        ]);

        DB::table('area_categoria')->insert([
            'area_id' => $request->area_id,
            'categoria_id' => $request->categoria_id,
            'estadoAreaCategoria' => $request->estadoAreaCategoria,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Relación área-categoría creada con éxito']);
    }

    // Eliminar una relación específica
    public function destroy($areaId, $categoriaId)
    {
        DB::table('area_categoria')
            ->where('area_id', $areaId)
            ->where('categoria_id', $categoriaId)
            ->delete();

        return response()->json(['message' => 'Relación eliminada con éxito']);
    }
}
