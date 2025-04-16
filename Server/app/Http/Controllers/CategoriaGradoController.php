<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriaGradoController extends Controller
{
    // Obtener todas las relaciones categoría-grado
    public function index()
    {
        $relaciones = DB::table('categoria_grados')->get();
        return response()->json($relaciones);
    }

    // Crear una nueva relación
    public function store(Request $request)
    {
        $request->validate([
            'categoria_id' => 'required|exists:categorias,idCategoria',
            'grado_id' => 'required|exists:grados,idGrado',
            'estadoCategoriaGrado' => 'required|boolean',
        ]);

        DB::table('categoria_grados')->insert([
            'categoria_id' => $request->categoria_id,
            'grado_id' => $request->grado_id,
            'estadoCategoriaGrado' => $request->estadoCategoriaGrado,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Relación categoría-grado creada con éxito']);
    }

    // Eliminar una relación específica
    public function destroy($categoriaId, $gradoId)
    {
        DB::table('categoria_grados')
            ->where('categoria_id', $categoriaId)
            ->where('grado_id', $gradoId)
            ->delete();

        return response()->json(['message' => 'Relación eliminada con éxito']);
    }
}
