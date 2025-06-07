<?php

namespace App\Http\Controllers;

use App\Services\CategoriaGradoService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function show($id)
    {
        try {
            $relacion = $this->service->getRelationById($id);
            return response()->json($relacion);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Relación no encontrada'], 404);
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
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Relación no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteRelation($id);
            return response()->json(['message' => 'Relación eliminada']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Relación no encontrada'], 404);
        }
    }

    public function cambiarEstado(Request $request, $id)
    {
        try {
            $request->validate([
                'estadoCategoriaGrado' => 'required|boolean'
            ]);

            $relacion = $this->service->changeRelationStatus($id, $request->estadoCategoriaGrado);
            return response()->json([
                'message' => 'Estado de la relación actualizado',
                'data' => $relacion
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Relación no encontrada'], 404);
        }
    }

    public function actualizarCategoriaYGrados(Request $request, $idCategoria)
    {
        try {
            $categoria = $this->service->updateCategoriaAndGrados($idCategoria, $request->all());
            return response()->json([
                'message' => 'Categoría y grados asociados actualizados correctamente',
                'data' => $categoria
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}