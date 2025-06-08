<?php

namespace App\Http\Controllers;

use App\Services\CategoriaGradoService;
use Illuminate\Http\Request;

class CategoriaGradoController extends Controller
{
    protected $service;

    public function __construct(CategoriaGradoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $relaciones = $this->service->getAllRelations();
        return response()->json($relaciones);
    }

    public function store(Request $request)
    {
        try {
            $relacion = $this->service->createRelation($request->all());
            return response()->json([
                'message' => 'Relación creada correctamente',
                'data' => $relacion
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $relacion = $this->service->updateRelation($id, $request->all());
            return response()->json([
                'message' => 'Relación actualizada',
                'data' => $relacion
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteRelation($id);
            return response()->json(['message' => 'Relación eliminada']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function cambiarEstado(Request $request, $id)
    {
        try {
            $relacion = $this->service->updateRelationStatus($id, $request->estadoCategoriaGrado);
            return response()->json([
                'message' => 'Estado de la relación actualizado',
                'data' => $relacion
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function actualizarCategoriaYGrados(Request $request, $idCategoria)
    {
        try {
            $result = $this->service->updateCategoriaAndGrados($idCategoria, $request->all());
            return response()->json([
                'message' => 'Categoría y grados asociados actualizados correctamente',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }
}