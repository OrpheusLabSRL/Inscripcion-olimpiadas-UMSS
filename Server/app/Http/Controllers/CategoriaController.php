<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\OlimpiadaAreaCategoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriaController extends Controller
{
    // Obtener todas las categorías con grados y combinaciones
    public function index()
    {
        $categorias = Categoria::with(['grados', 'combinaciones.area', 'combinaciones.olimpiada'])->get();
        return response()->json($categorias);
    }

    // Obtener una sola categoría con sus relaciones
    public function show($id)
    {
        $categoria = Categoria::with(['grados', 'combinaciones.area', 'combinaciones.olimpiada'])->findOrFail($id);
        return response()->json($categoria);
    }

    // Guardar una nueva categoría con grados y asignarla a una combinación de olimpiada y área
    public function store(Request $request)
    {
        $request->validate([
            'nombreCategoria' => 'required|string|unique:categoria,nombreCategoria',
            'estado' => 'required|boolean',
            'idArea' => 'required|exists:area,idArea',
            'idGrado' => 'required|exists:grado,idGrado',
            'idOlimpiada' => 'required|exists:olimpiada,idOlimpiada',
        ]);

        DB::transaction(function () use ($request) {
            $categoria = new Categoria();
            $categoria->nombreCategoria = $request->nombreCategoria;
            $categoria->estadoCategoria = $request->estado;
            $categoria->save();

            // Crear la relación en olimpiada_area_categoria
            OlimpiadaAreaCategoria::create([
                'idOlimpiada' => $request->idOlimpiada,
                'idArea' => $request->idArea,
                'idCategoria' => $categoria->idCategoria,
                'estado' => true,
            ]);

            // Relación con grado
            DB::table('categoria_grado')->insert([
                'idCategoria' => $categoria->idCategoria,
                'idGrado' => $request->idGrado,
                'estadoCategoriaGrado' => 1
            ]);
        });

        return response()->json(['message' => 'Categoría creada con éxito']);
    }

    // Actualizar una categoría y sus relaciones
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'nombreCategoria' => 'required|string|unique:categoria,nombreCategoria,' . $id . ',idCategoria',
            'estado' => 'required|boolean',
            'idArea' => 'required|exists:area,idArea',
            'idGrado' => 'required|exists:grado,idGrado',
            'idOlimpiada' => 'required|exists:olimpiada,idOlimpiada',
        ]);

        DB::transaction(function () use ($request, $categoria) {
            $categoria->update([
                'nombreCategoria' => $request->nombreCategoria,
                'estadoCategoria' => $request->estado,
            ]);

            // Limpiar relaciones previas
            OlimpiadaAreaCategoria::where('idCategoria', $categoria->idCategoria)->delete();
            DB::table('categoria_grado')->where('idCategoria', $categoria->idCategoria)->delete();

            // Insertar nuevas relaciones
            OlimpiadaAreaCategoria::create([
                'idOlimpiada' => $request->idOlimpiada,
                'idArea' => $request->idArea,
                'idCategoria' => $categoria->idCategoria,
                'estado' => true,
            ]);

            DB::table('categoria_grado')->insert([
                'idCategoria' => $categoria->idCategoria,
                'idGrado' => $request->idGrado,
                'estadoCategoriaGrado' => 1
            ]);
        });

        return response()->json(['message' => 'Categoría actualizada con éxito']);
    }

    // Eliminar una categoría y sus relaciones
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        OlimpiadaAreaCategoria::where('idCategoria', $id)->delete();
        DB::table('categoria_grado')->where('idCategoria', $id)->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
