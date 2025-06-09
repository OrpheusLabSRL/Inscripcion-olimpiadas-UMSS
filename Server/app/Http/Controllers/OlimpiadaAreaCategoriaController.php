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
        return $this->service->getAllCombinations();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $results = [];

        foreach ($data as $item) {
            try {
                $this->service->createCombinations($item);
                $results[] = ['success' => true, 'data' => $item];
            } catch (\Exception $e) {
                $results[] = [
                    'success' => false,
                    'message' => $e->getMessage(),
                    'data' => $item
                ];
            }
        }

        $hasErrors = collect($results)->contains('success', false);

        return response()->json([
            'message' => $hasErrors ? 'Algunas combinaciones no se pudieron registrar' : 'Todas las combinaciones registradas con éxito',
            'results' => $results
        ], $hasErrors ? 207 : 201);
    }

    public function destroy($id)
    {
        $this->service->deleteCombination($id);
        return response()->json(['mensaje' => 'Combinación eliminada']);
    }

    public function porOlimpiada($idOlimpiada)
    {
        $resultados = $this->service->getByOlimpiadaGrouped($idOlimpiada);
        return response()->json($resultados);
    }

    public function eliminarPorOlimpiadaYArea($idOlimpiada, $idArea)
    {
        $this->service->deleteByOlimpiadaAndArea($idOlimpiada, $idArea);
        return response()->json(['message' => 'Combinaciones del área eliminadas correctamente.']);
    }
}