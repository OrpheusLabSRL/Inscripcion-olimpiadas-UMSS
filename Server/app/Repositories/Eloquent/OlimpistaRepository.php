<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\OlimpistaRepositoryInterface;
use App\Models\Olimpista;
use Illuminate\Support\Facades\DB;

class OlimpistaRepository implements OlimpistaRepositoryInterface
{
    public function getAllWithDetails()
    {
        return DB::table('olimpistas')
            ->leftJoin('personas', 'olimpistas.idPersona', '=', 'personas.idPersona')
            ->leftJoin('inscripciones', 'olimpistas.idPersona', '=', 'inscripciones.idOlimpista')
            ->leftJoin('olimpiadas_areas_categorias', 'inscripciones.idOlimpAreaCategoria', '=', 'olimpiadas_areas_categorias.idOlimpAreaCategoria')
            ->leftJoin('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
            ->leftJoin('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
            ->select(
                'personas.carnetIdentidad as carnetDeIdentidad',
                'personas.nombre',
                'personas.apellido',
                'olimpistas.fechaNacimiento',
                'olimpistas.departamento',
                'olimpistas.curso',
                'olimpistas.colegio',
                'areas.nombreArea',
                'categorias.nombreCategoria as nombreCategoria'
            )
            ->distinct()
            ->get();
    }

    public function getOlympiadRegistrationsReport(){
    return \DB::table('olimpiadas')
        ->join('olimpiadas_areas_categorias', 'olimpiadas.idOlimpiada', '=', 'olimpiadas_areas_categorias.idOlimpiada')
        ->join('inscripciones', 'olimpiadas_areas_categorias.idOlimpAreaCategoria', '=', 'inscripciones.idOlimpAreaCategoria')
        ->join('olimpistas', 'inscripciones.idOlimpista', '=', 'olimpistas.idPersona')
        ->join('personas', 'olimpistas.idPersona', '=', 'personas.idPersona')
        ->select(
            'olimpiadas.nombreOlimpiada as nombre_olimpiada',
            'olimpiadas.version as edicion_olimpiada',
            'personas.carnetIdentidad as carnet_identidad_olimpista',
            'personas.nombre as nombre_olimpista',
            'personas.apellido as apellido_olimpista',
            \DB::raw('(SELECT COUNT(DISTINCT insc.idOlimpista) FROM inscripciones insc JOIN olimpiadas_areas_categorias oac ON insc.idOlimpAreaCategoria = oac.idOlimpAreaCategoria WHERE oac.idOlimpiada = olimpiadas.idOlimpiada) as total_olimpistas')
        )
        ->groupBy(
            'olimpiadas.idOlimpiada',
            'olimpiadas.nombreOlimpiada',
            'olimpiadas.version',
            'personas.carnetIdentidad',
            'personas.nombre',
            'personas.apellido'
        )
        ->get();
    }

    public function actualizarOCrear(array $criterios, array $datos): Olimpista
    {
        return Olimpista::updateOrCreate($criterios, $datos);
    }

    public function buscarPorId(int $id): ?Olimpista
    {
        return Olimpista::find($id);
    }

    public function buscarPorPersona(int $idPersona): ?Olimpista
    {
        return Olimpista::where('idPersona', $idPersona)->first();
    }

    public function crear(array $datos): Olimpista
    {
        return Olimpista::create($datos);
    }

    public function actualizar(int $id, array $datos): bool
    {
        return Olimpista::where('idOlimpista', $id)->update($datos);
    }
}
