<?php

namespace App\Http\Controllers;

use App\Services\GradoService;
use Illuminate\Http\Request;

class GradoController extends Controller
{
    protected $service;

    public function __construct(GradoService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'activos' => $request->query('activos', false),
            'nivel' => $request->query('nivel')
        ];

        $grados = $this->service->getAllGrados($filters);
        return response()->json($grados);
    }

    public function show($id)
    {
        try {
            $grado = $this->service->getGradoById($id);
            return response()->json($grado);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $grado = $this->service->createGrado($request->all());
            return response()->json([
                'message' => 'Grado creado correctamente',
                'data' => $grado
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

    public function update(Request $request, $id)
    {
        try {
            $grado = $this->service->updateGrado($id, $request->all());
            return response()->json([
                'message' => 'Grado actualizado correctamente',
                'data' => $grado
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
            return response()->json([
                'message' => 'Grado no encontrado'
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteGrado($id);
            return response()->json(['message' => 'Grado eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }
    }
}