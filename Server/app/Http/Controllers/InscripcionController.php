<?php

namespace App\Http\Controllers;

use App\Models\OlimpiadaAreaCategoria;
use App\Models\Area;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Olimpista;
use Illuminate\Support\Facades\DB;

class InscripcionController extends Controller
{
    public function store(Request $request)
{
    DB::beginTransaction();
    try {
        $inscripciones = [];

        // Combinación principal
        $areaCategoria = OlimpiadaAreaCategoria::where('idArea', $request->Area)
            ->where('idCategoria', $request->Categoria)
            ->first();

        if (!$areaCategoria) {
            DB::rollBack();
            return response()->json([
                'message' => 'No se encontró una combinación válida de Área y Categoría principal.'
            ], 404);
        }

        // Armar los datos de inscripción principal
        $dataPrincipal = [
            'estado' => $request->estado,
            'fechaInicio' => Carbon::now()->toDateString(),
            'fechaFin' => Carbon::now()->addDays(5),
            'id_olimpista' => $request->id_olimpista,
            'idOlimpAreaCategoria' => $areaCategoria->idOlimpAreaCategoria,
        ];

        // Agregar id_tutor si está presente
        if ($request->filled('id_tutor1')) {
            $dataPrincipal['id_tutor'] = $request->id_tutor1;
        }

        $inscripciones[] = Inscripcion::create($dataPrincipal);

        // Combinación opcional
        if (!empty($request->AreaOpcional) && !empty($request->CategoriaOpcional)) {
            $areaCategoriaOpcional = OlimpiadaAreaCategoria::where('idArea', $request->AreaOpcional)
                ->where('idCategoria', $request->CategoriaOpcional)
                ->first();

            if (!$areaCategoriaOpcional) {
                DB::rollBack();
                return response()->json([
                    'message' => 'No se encontró una combinación válida de Área y Categoría opcional.'
                ], 404);
            }

            $dataOpcional = [
                'estado' => $request->estado,
                'fechaInicio' => Carbon::now()->toDateString(),
                'fechaFin' => Carbon::now()->addDays(5),
                'id_olimpista' => $request->id_olimpista,
                'idOlimpAreaCategoria' => $areaCategoriaOpcional->idOlimpAreaCategoria,
            ];

            // También incluir id_tutor si está presente
            if ($request->filled('id_tutor2')) {
                $dataOpcional['id_tutor'] = $request->id_tutor2;
            }

            $inscripciones[] = Inscripcion::create($dataOpcional);
        }

        DB::commit();

        return response()->json([
            'message' => 'Inscripción(es) creada(s) exitosamente.',
            'data' => $inscripciones
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Error al crear las inscripciones.',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function getAreaByOlimpista($id_olimpista)
{
    // Verificar si el olimpista existe
    $olimpista = Olimpista::find($id_olimpista);
    
    if (!$olimpista) {
        return response()->json([
            'success' => false,
            'message' => 'Olimpista no encontrado'
        ], 404);
    }

    // Obtener las inscripciones del olimpista
    $inscripciones = Inscripcion::where('id_olimpista', $id_olimpista)->get();

    // Obtener los id_AreaCategoria únicos
    $areaCategoriaIds = $inscripciones->pluck('idOlimpAreaCategoria')->unique();

    // Obtener las áreas-categorías involucradas
    $areaCategorias = OlimpiadaAreaCategoria::with('area', 'categoria') // Asegúrate de tener estas relaciones
        ->whereIn('idOlimpAreaCategoria', $areaCategoriaIds)
        ->get();

    // Agrupar por área
    $areasConCategorias = $areaCategorias->groupBy('idArea')->map(function ($items, $areaId) {
        $area = $items->first()->area;

        return [
            'idArea' => $area->idArea,
            'nombreArea' => $area->nombreArea,
            'descripcionArea' => $area->descripcionArea,
            'costoArea' => $area->costoArea,
            'estadoArea' => $area->estadoArea,
            'categorias' => $items->map(function ($item) {
                return [
                    'idCategoria' => $item->categoria->idCategoria ?? null,
                    'nombreCategoria' => $item->categoria->nombreCategoria ?? null,
                    'estadoCategoria' => $item->categoria->descripcionCategoria ?? null,
                ];
            })->values()
        ];
    })->values();

    return response()->json([
        'success' => true,
        'data' => [
            'olimpista' => $olimpista,
            'areas' => $areasConCategorias
        ]
    ], 200);
}

    

}
