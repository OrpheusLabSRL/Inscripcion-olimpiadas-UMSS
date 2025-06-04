<?php

namespace App\Http\Controllers;

use App\Models\CategoriaGrado;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriaGradoController extends Controller
{
    // Obtener todas las relaciones
    public function index()
    {
        return response()->json(CategoriaGrado::with(['categoria', 'grado'])->get());
    }

    // Crear una nueva relación
    public function store(Request $request)
    {
        $request->validate([
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'idGrado' => 'required|exists:grado,idGrado',
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        $relacion = CategoriaGrado::create($request->only([
            'idCategoria',
            'idGrado',
            'estadoCategoriaGrado'
        ]));

        return response()->json([
            'message' => 'Relación creada correctamente',
            'data' => $relacion
        ], 201);
    }

    // Actualizar una relación existente
    public function update(Request $request, $id)
    {
        $relacion = CategoriaGrado::findOrFail($id);

        $request->validate([
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'idGrado' => 'required|exists:grado,idGrado',
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        $relacion->update($request->only([
            'idCategoria',
            'idGrado',
            'estadoCategoriaGrado'
        ]));

        return response()->json([
            'message' => 'Relación actualizada',
            'data' => $relacion
        ]);
    }



    // Eliminar una relación
    public function destroy($id)
    {
        $relacion = CategoriaGrado::findOrFail($id);
        $relacion->delete();

        return response()->json(['message' => 'Relación eliminada']);
    }

        public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estadoCategoriaGrado' => 'required|boolean'
        ]);

        $relacion = CategoriaGrado::findOrFail($id);
        $relacion->update([
            'estadoCategoriaGrado' => $request->estadoCategoriaGrado
        ]);

        return response()->json([
            'message' => 'Estado de la relación actualizado',
            'data' => $relacion
        ]);
    }
    
        public function actualizarCategoriaYGrados(Request $request, $idCategoria)
    {
        $request->validate([
            'nombreCategoria' => 'required|string|max:255',
            'grados' => 'required|array',
            'grados.*' => 'exists:grados,idGrado',
            'estadoCategoriaGrado' => 'sometimes|boolean'
        ]);

        DB::transaction(function () use ($request, $idCategoria) {
            // Actualizar el nombre de la categoría
            $categoria = Categoria::findOrFail($idCategoria);
            $categoria->update([
                'nombreCategoria' => $request->nombreCategoria
            ]);

            // Sincronizar los grados asociados
            $estado = $request->has('estadoCategoriaGrado') ? $request->estadoCategoriaGrado : true;
            
            $syncData = [];
            foreach ($request->grados as $gradoId) {
                $syncData[$gradoId] = ['estadoCategoriaGrado' => $estado];
            }

            $categoria->grados()->sync($syncData);
        });

        return response()->json([
            'message' => 'Categoría y grados asociados actualizados correctamente',
            'data' => Categoria::with('grados')->find($idCategoria)
        ]);
    }
}
