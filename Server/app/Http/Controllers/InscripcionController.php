<?php

namespace App\Http\Controllers;

use App\Models\AreaCategoria;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
}
