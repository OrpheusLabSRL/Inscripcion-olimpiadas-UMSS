<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::with(['areas', 'grados'])->get();
        return response()->json($categorias);
    }

    public function show($id)
    {
        $categoria = Categoria::with(['areas', 'grados'])->findOrFail($id);
        return response()->json($categoria);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombreCategoria' => 'required|string|unique:categorias,nombreCategoria',
            'estado' => 'required|boolean',
            'idArea' => 'required|exists:areas,idArea',
            'idGrado' => 'required|exists:grados,idGrado',
        ]);

        DB::transaction(function () use ($request) {
            // ⚠ Usa el modelo y asegúrate de guardar
            $categoria = new Categoria();
            $categoria->nombreCategoria = $request->nombreCategoria;
            $categoria->estadoCategoria = $request->estado;
            $categoria->save(); // 💥 Aquí se genera el ID correctamente

            // ✅ Inserta en tablas intermedias después del save
            DB::table('area_categoria')->insert([
                'area_id' => $request->idArea,
                'categoria_id' => $categoria->idCategoria, // Ahora tiene valor
                'estadoAreaCategoria' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('categoria_grados')->insert([
                'grado_id' => $request->idGrado,
                'categoria_id' => $categoria->idCategoria,
                'estadoCategoriaGrado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Categoría creada con éxito']);
    }
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'nombreCategoria' => 'required|string|unique:categorias,nombreCategoria,' . $id . ',idCategoria',
            'estado' => 'required|boolean',
            'idArea' => 'required|exists:areas,idArea',
            'idGrado' => 'required|exists:grados,idGrado',
        ]);

        DB::transaction(function () use ($request, $categoria) {
            $categoria->update([
                'nombreCategoria' => $request->nombreCategoria,
                'estadoCategoria' => $request->estado,
            ]);

            // Borrar relaciones anteriores
            DB::table('area_categoria')->where('categoria_id', $categoria->idCategoria)->delete();
            DB::table('categoria_grados')->where('categoria_id', $categoria->idCategoria)->delete();

            // Insertar nuevas relaciones
            DB::table('area_categoria')->insert([
                'area_id' => $request->idArea,
                'categoria_id' => $categoria->idCategoria,
                'estadoAreaCategoria' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('categoria_grados')->insert([
                'grado_id' => $request->idGrado,
                'categoria_id' => $categoria->idCategoria,
                'estadoCategoriaGrado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Categoría actualizada con éxito']);
    }

    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        // También puedes limpiar sus relaciones si lo deseas
        DB::table('area_categoria')->where('categoria_id', $id)->delete();
        DB::table('categoria_grados')->where('categoria_id', $id)->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
