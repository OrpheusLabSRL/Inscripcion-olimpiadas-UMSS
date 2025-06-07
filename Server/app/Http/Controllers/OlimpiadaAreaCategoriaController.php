<?php

namespace App\Http\Controllers;

use App\Services\OlimpiadaAreaCategoriaService;
use Illuminate\Http\Request;

class OlimpiadaAreaCategoriaController extends Controller
{
    protected $service;

    public function __construct(OlimpiadaAreaCategoriaService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $combinaciones = $this->service->getAllCombinations();
        return response()->json($combinaciones);
    }

    public function store(Request $request)
    {
        try {
            $results = $this->service->createOrUpdateCombinations($request->all());
            return response()->json([
                'message' => 'Combinaciones registradas con éxito',
                'data' => $results
            ], 201);
        } catch (\InvalidArgumentException $e) {
            $errors = json_decode($e->getMessage(), true);
            return response()->json([
                'message' => 'Error en algunas combinaciones',
                'errors' => $errors
            ], 422);
        }
    }

    public function destroy($id)
    {
        $this->service->deleteCombination($id);
        return response()->json(['message' => 'Combinación eliminada']);
    }

    public function porOlimpiada($idOlimpiada)
    {
        $resultados = $this->service->getByOlimpiadaGrouped($idOlimpiada);
        return response()->json($resultados);
    }

    public function eliminarPorOlimpiadaYArea($idOlimpiada, $idArea)
    {
        $this->service->deleteByOlimpiadaAndArea($idOlimpiada, $idArea);
        return response()->json([
            'message' => 'Combinaciones del área eliminadas correctamente'
        ]);
    }
}