<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OlimpiadaAreaCategoria;
use Illuminate\Support\Facades\Validator;

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
            $validator = Validator::make($item, [
                'idOlimpiada' => 'required|exists:olimpiadas,idOlimpiada',
                'idArea' => 'required|exists:areas,idArea',
                'idCategoria' => 'required|exists:categorias,idCategoria',
                'costo' => 'required|numeric|min:0',
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
                    'costo' => $item['costo'],
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
            ->with(['area', 'categoria.grados'])
            ->get()
            ->groupBy('idArea');

        $resultados = [];

        foreach ($combinaciones as $idArea => $grupo) {
            $area = $grupo->first()->area;

            $categorias = $grupo->map(function ($combinacion) {
                $cat = $combinacion->categoria;
                return [
                    'idCategoria' => $cat->idCategoria,
                    'nombreCategoria' => $cat->nombreCategoria,
                    'costo' => $combinacion->costo,
                    'grados' => $cat->grados->map(function ($grado) {
                        return [
                            'idGrado' => $grado->idGrado,
                            'numeroGrado' => $grado->numeroGrado,
                            'nivel' => $grado->nivel,
                        ];
                    })
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

    public function eliminarPorOlimpiada($idOlimpiada)
    {
        OlimpiadaAreaCategoria::where('idOlimpiada', $idOlimpiada)->delete();

        return response()->json(['message' => 'Todas las combinaciones eliminadas correctamente.']);
    }
}
