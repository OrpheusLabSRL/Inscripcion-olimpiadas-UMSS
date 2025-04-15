<?php

namespace App\Http\Controllers;

use App\Models\AreaCategoria;
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
        $areaCategoria = AreaCategoria::where('area_id', $request->Area)
            ->where('categoria_id', $request->Categoria)
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
            'id_AreaCategoria' => $areaCategoria->id_AreaCategoria,
        ];

        // Agregar id_tutor si está presente
        if ($request->filled('id_tutor1')) {
            $dataPrincipal['id_tutor'] = $request->id_tutor1;
        }

        $inscripciones[] = Inscripcion::create($dataPrincipal);

        // Combinación opcional
        if (!empty($request->AreaOpcional) && !empty($request->CategoriaOpcional)) {
            $areaCategoriaOpcional = AreaCategoria::where('area_id', $request->AreaOpcional)
                ->where('categoria_id', $request->CategoriaOpcional)
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
                'id_AreaCategoria' => $areaCategoriaOpcional->id_AreaCategoria,
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
        $areaCategoriaIds = $inscripciones->pluck('id_AreaCategoria')->unique();
        
        // Obtener las áreas categorías
        $areaCategorias = AreaCategoria::whereIn('id_AreaCategoria', $areaCategoriaIds)->get();
        
        // Obtener los id_area (ojo con los nombres personalizados)
        $areaIds = $areaCategorias->pluck('area_id')->unique();
        
        // Obtener las áreas correspondientes
        $areas = Area::whereIn('idArea', $areaIds)->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'olimpista' => $olimpista,
                'areas' => $areas
            ]
        ], 200);
    }
    

}
