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

    public function index()
    {
        return response()->json($this->service->getAllCategorias());
    }

    public function show($id)
    {
        $categoria = $this->service->getCategoria($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        return response()->json($categoria);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombreCategoria' => 'required|string',
            'estadoCategoria' => 'required|boolean',
        ]);

        try {
            $categoria = $this->service->createCategoria($request->only(['nombreCategoria', 'estadoCategoria']));
            
            return response()->json([
                'message' => 'Categoría creada con éxito',
                'data' => $categoria
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $categoria = $this->service->getCategoria($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $request->validate([
            'nombreCategoria' => 'required|string',
            'estadoCategoria' => 'required|boolean',
        ]);

        try {
            $categoria = $this->service->updateCategoria($id, $request->only(['nombreCategoria', 'estadoCategoria']));
            
            return response()->json([
                'message' => 'Categoría actualizada con éxito',
                'data' => $categoria
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $categoria = $this->service->getCategoria($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $this->service->deleteCategoria($id);

        return response()->json(['message' => 'Categoría eliminada']);
    }

        
}