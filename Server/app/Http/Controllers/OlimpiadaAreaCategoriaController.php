<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OlimpiadaAreaCategoria;

class OlimpiadaAreaCategoriaController extends Controller
{
    // Obtener todas las combinaciones con relaciones
    public function index()
    {
        return OlimpiadaAreaCategoria::with(['olimpiada', 'area', 'categoria'])->get();
    }

    // Crear nuevas combinaciones (puede recibir múltiples)
    public function store(Request $request)
    {
        $data = $request->all();

        foreach ($data as $item) {
            $validator = \Validator::make($item, [
                'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
                'idArea' => 'required|exists:areas,idArea',
                'idCategoria' => 'required|exists:categorias,idCategoria',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $validator->errors(),
                ], 422);
            }

            OlimpiadaAreaCategoria::firstOrCreate(
                [
                    'idOlimpiada' => $item['idOlimpiada'],
                    'idArea' => $item['idArea'],
                    'idCategoria' => $item['idCategoria'],
                ],
                [
                    'estado' => true,
                ]
            );
        }

        return response()->json([
            'message' => 'Combinaciones registradas con éxito',
        ], 201);
    }

    // Eliminar una combinación específica
    public function destroy($id)
    {
        $item = OlimpiadaAreaCategoria::findOrFail($id);
        $item->delete();

        return response()->json(['mensaje' => 'Combinación eliminada']);
    }

    // Obtener combinaciones de una olimpiada (agrupadas por área)
    public function porOlimpiada($idOlimpiada)
    {
        $combinaciones = OlimpiadaAreaCategoria::where('idOlimpiada', $idOlimpiada)
            ->with(['area', 'categoria'])
            ->get()
            ->groupBy('idArea');

        $resultados = [];

        foreach ($combinaciones as $idArea => $grupo) {
            $area = $grupo->first()->area;
            $categorias = $grupo->pluck('categoria')->map(function ($cat) {
                return [
                    'idCategoria' => $cat->idCategoria,
                    'nombreCategoria' => $cat->nombreCategoria
                ];
            });

            $resultados[] = [
                'idArea' => $area->idArea,
                'nombreArea' => $area->nombreArea,
                'categorias' => $categorias,
            ];
        }

        return response()->json($resultados);
    }
}
