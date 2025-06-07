<?php

namespace App\Http\Controllers;

use App\Services\OlimpiadaService;
use Illuminate\Http\Request;

class OlimpiadaController extends Controller
{
    protected $service;

    public function __construct(OlimpiadaService $service)
    {
        $this->service = $service;
    }

    public function mostrarOlimpiada(Request $request)
    {
        $filters = [
            'activas' => $request->query('activas', false),
            'nombre' => $request->query('nombre')
        ];

        $olimpiadas = $this->service->getAllOlimpiadas($filters);
        return response()->json(['data' => $olimpiadas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreOlimpiada' => 'required|string|max:100',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimpiada' => 'required|date',
            'fechaFinOlimpiada' => 'required|date|after:fechaInicioOlimpiada',
        ]);

        try {
            $olimpiada = $this->service->createOlimpiada($validated);
            return response()->json([
                'message' => 'Olimpiada creada exitosamente',
                'data' => $olimpiada
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombreOlimpiada' => 'required|string|max:100',
            'version' => 'required|integer|min:1',
            'fechaInicioOlimpiada' => 'required|date',
            'fechaFinOlimpiada' => 'required|date|after:fechaInicioOlimpiada',
            'estadoOlimpiada' => 'required|boolean',
        ]);

        try {
            $olimpiada = $this->service->updateOlimpiada($id, $validated);
            return response()->json([
                'message' => 'Olimpiada actualizada correctamente',
                'data' => $olimpiada
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Olimpiada no encontrada'], 404);
        }
    }

    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estadoOlimpiada' => 'required|boolean',
        ]);

        try {
            $olimpiada = $this->service->changeOlimpiadaStatus($id, $request->estadoOlimpiada);
            return response()->json([
                'message' => 'Estado actualizado correctamente',
                'data' => $olimpiada
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Olimpiada no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteOlimpiada($id);
            return response()->json(['message' => 'Olimpiada eliminada correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Olimpiada no encontrada'], 404);
        }
    }
}