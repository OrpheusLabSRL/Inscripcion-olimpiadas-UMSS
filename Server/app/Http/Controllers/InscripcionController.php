<?php

namespace App\Http\Controllers;

use App\Models\AreaCategoria;
use App\Models\Area;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Olimpista;

class InscripcionController extends Controller
{
    public function store(Request $request)
    {

        $areaCategoria = AreaCategoria::where('area_id', $request->Area)
        ->where('categoria_id', $request->Categoria)
        ->first();

    if (!$areaCategoria) {
        return response()->json([
            'message' => 'No se encontró una combinación válida de área y categoría.'
        ], 404);
    }
        $inscripcion = Inscripcion::create([
            'estado' => $request->estado,
            'fechaInicio' => Carbon::now()->toDateString(), // fecha actual
            'fechaFin' => Carbon::now()->addDays(5),
            'id_olimpista' => $request->id_olimpista,
            'id_AreaCategoria' =>$areaCategoria->id_AreaCategoria,
        ]);

        return response()->json([
            'message' => 'Inscripción creada exitosamente.',
            'data' => $inscripcion
        ], 201);
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
