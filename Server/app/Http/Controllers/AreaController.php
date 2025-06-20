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
            'nombreArea' => 'nullable|string|max:50',
            'descripcionArea' => 'nullable|string|max:200',
            'estadoArea' => 'sometimes|boolean',
        ]);

        $this->service->createArea($validated);

        return response()->json(['message' => 'Área registrada correctamente']);
    }

    public function getProgramaCompleto()
    {
        $programa = $this->service->getProgramaCompleto();
        return response()->json($programa);
    }

   
    public function update(Request $request, $id)
    {
        try {
            // Validar los datos recibidos
            $validated = $request->validate([
                'nombreArea' => 'required|string|max:255',
                'descripcionArea' => 'nullable|string',
            ]);

     
            $this->service->updateArea($id, $validated);

            return response()->json([
                'message' => 'Área actualizada correctamente'
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Error al actualizar el área: ' . $e->getMessage());

            return response()->json([
                'message' => 'Ocurrió un error al actualizar el área.',
                'error' => $e->getMessage()
            ], 500);
        }
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