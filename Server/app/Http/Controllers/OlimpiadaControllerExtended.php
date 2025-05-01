<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OlimpiadaControllerExtended extends Controller
{
    public function mostrarOlimpiadaExtendida()
    {
        $olimpiadas = DB::table('olimpiadas')
            ->join('olimpiadas_areas_categorias', 'olimpiadas.idOlimpiada', '=', 'olimpiadas_areas_categorias.idOlimpiada')
            ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
            ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
            ->join('reservas', function ($join) {
                $join->on('reservas.idCategoria', '=', 'olimpiadas_areas_categorias.idCategoria')
                     ->on('reservas.estadoReserva', '=', DB::raw('1'));
            })
            ->join('aulas', 'reservas.idAula', '=', 'aulas.idAula')
            ->select(
                'olimpiadas.nombreOlimpiada',
                'olimpiadas.version',
                'olimpiadas.estadoOlimpiada',
                'olimpiadas.fechaInicioOlimpiada as fechaInicio',
                'olimpiadas.fechaFinOlimpiada as fechaFin',
                'areas.nombreArea as area',
                'categorias.nombreCategoria as categoria',
                'reservas.fechaReserva',
                'reservas.horaInicio',
                'reservas.horaFin',
                'aulas.nombreAula'
            )
            ->where('olimpiadas.estadoOlimpiada', 1)
            ->get();

        return response()->json(['data' => $olimpiadas]);
    }
}
