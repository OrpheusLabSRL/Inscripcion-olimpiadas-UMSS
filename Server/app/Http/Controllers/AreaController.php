<?php

namespace App\Http\Controllers;

use App\Services\AreaService;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    protected $service;

    public function __construct(AreaService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $areas = $this->service->getAllAreas([
            'estado' => $request->query('estadoArea')
        ]);
        
        return response()->json($areas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreArea' => 'required|string|max:255',
            'descripcionArea' => 'nullable|string',
            'estadoArea' => 'sometimes|boolean',
        ]);

        $area = $this->service->createArea($validated);
        
        return response()->json([
            'message' => 'Área creada exitosamente',
            'data' => $area
        ], 201);
    }

    public function getProgramaCompleto($olimpiadaId)
    {
        $programa = $this->service->getFormattedProgram($olimpiadaId);
        return response()->json($programa);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombreArea' => 'required|string|max:255',
            'descripcionArea' => 'nullable|string',
        ]);

        $area = $this->service->updateArea($id, $validated);
        
        return response()->json([
            'message' => 'Área actualizada exitosamente',
            'data' => $area
        ]);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $validated = $request->validate([
            'estadoArea' => 'required|boolean',
        ]);

        $area = $this->service->changeAreaStatus($id, $validated['estadoArea']);
        
        return response()->json([
            'message' => 'Estado del área actualizado',
            'data' => $area
        ]);
    }

    public function destroy($id)
    {
        $this->service->deleteArea($id);
        return response()->json(['message' => 'Área eliminada exitosamente']);
    }
}