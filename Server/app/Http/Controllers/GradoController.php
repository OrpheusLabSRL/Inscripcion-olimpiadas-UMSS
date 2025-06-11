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

    public function index()
    {
        $grados = $this->service->getAllGrados();
        return response()->json($grados);
    }

    public function show($idGrado)
    {
        $grado = $this->service->getGrado($idGrado);

        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->json($grado);
    }

    public function store(Request $request)
    {
        try {
            $grado = $this->service->createGrado($request->all());
            return response()->json([
                'message' => 'Grado creado correctamente',
                'data' => $grado
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function update(Request $request, $idGrado)
    {
        try {
            $grado = $this->service->updateGrado($idGrado, $request->all());
            
            if (!$grado) {
                return response()->json(['message' => 'Grado no encontrado'], 404);
            }

            return response()->json([
                'message' => 'Grado actualizado correctamente',
                'data' => $grado
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy($idGrado)
    {
        $success = $this->service->deleteGrado($idGrado);
        
        if (!$success) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->json(['message' => 'Grado eliminado correctamente']);
    }
}