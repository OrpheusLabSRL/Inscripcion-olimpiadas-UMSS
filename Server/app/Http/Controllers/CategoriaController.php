<?php

namespace App\Http\Controllers;

use App\Services\CategoriaService;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    protected $service;

    public function __construct(CategoriaService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'activas' => $request->query('activas', false),
            'nombre' => $request->query('nombre')
        ];

        $categorias = $this->service->getAllCategorias($filters);
        return response()->json($categorias);
    }

    public function show($id)
    {
        try {
            $categoria = $this->service->getCategoriaById($id);
            return response()->json($categoria);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreCategoria' => 'required|string|max:255',
            'estadoCategoria' => 'sometimes|boolean'
        ]);

        try {
            $categoria = $this->service->createCategoria($validated);
            return response()->json([
                'message' => 'Categoría creada con éxito',
                'data' => $categoria
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombreCategoria' => 'required|string|max:255',
            'estadoCategoria' => 'required|boolean'
        ]);

        try {
            $categoria = $this->service->updateCategoria($id, $validated);
            return response()->json([
                'message' => 'Categoría actualizada con éxito',
                'data' => $categoria
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteCategoria($id);
            return response()->json(['message' => 'Categoría eliminada']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
    }
}