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
