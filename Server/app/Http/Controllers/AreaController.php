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
        $areas = $this->service->getAllAreas();
        return response()->json($areas, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
            'estadoArea' => 'sometimes|boolean',
        ]);

        $this->service->createArea($validated);

        return response()->json(['message' => 'Área registrada correctamente']);
    }

    public function getProgramaCompleto($id)
    {
        $programa = $this->service->getProgramaCompleto($id);
        return response()->json($programa);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombreArea' => 'required|string',
            'descripcionArea' => 'nullable|string',
        ]);

        $this->service->updateArea($id, $validated);

        return response()->json(['message' => 'Área actualizada correctamente']);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $validated = $request->validate([
            'estadoArea' => 'required|boolean',
        ]);

        $this->service->changeAreaStatus($id, $validated['estadoArea']);

        return response()->json(['message' => 'Estado del área actualizado correctamente']);
    }

    public function destroy($id)
    {
        $this->service->deleteArea($id);
        return response()->json(['message' => 'Área eliminada correctamente']);
    }
}