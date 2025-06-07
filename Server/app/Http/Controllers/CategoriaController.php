<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    // Obtener todas las categorías
    public function index()
    {
        return response()->json(Categoria::all());
    }

    // Obtener una categoría por su ID
    public function show($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        return response()->json($categoria);
    }

    // Crear una nueva categoría
    public function store(Request $request)
    {
        $request->validate([
            'nombreCategoria' => 'required|string|unique:categoria,nombreCategoria',
            'estadoCategoria' => 'required|boolean',
        ]);

        $categoria = Categoria::create($request->only(['nombreCategoria', 'estadoCategoria']));

        return response()->json([
            'message' => 'Categoría creada con éxito',
            'data' => $categoria
        ], 201);
    }

    // Actualizar una categoría
    public function update(Request $request, $id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $request->validate([
            'nombreCategoria' => 'required|string|unique:categoria,nombreCategoria,' . $id . ',idCategoria',
            'estadoCategoria' => 'required|boolean',
        ]);

        $categoria->update($request->only(['nombreCategoria', 'estadoCategoria']));

        return response()->json([
            'message' => 'Categoría actualizada con éxito',
            'data' => $categoria
        ]);
    }

    // Eliminar una categoría
    public function destroy($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
