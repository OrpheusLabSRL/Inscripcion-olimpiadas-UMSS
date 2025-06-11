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

    public function storeWithGrados(Request $request)
    {
        try {
            $data = $request->validate([
                'nombreCategoria' => 'required|string|max:255',
                'grados' => 'required|array|min:1',
                'grados.*' => 'exists:grados,idGrado',
                'estadoCategoriaGrado' => 'sometimes|boolean'
            ]);

            $result = $this->service->createCategoriaWithGrados($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Categoría creada con grados asociados exitosamente',
                'data' => $result
            ], 201);
        } catch (\Exception $e) {
            // Asegurarse de que el código de estado sea un número entero
            $statusCode = is_numeric($e->getCode()) && $e->getCode() >= 400 ? $e->getCode() : 500;
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $statusCode === 400 ? $e->getMessage() : 'Error al procesar la solicitud'
            ], $statusCode);
        }
    }
}