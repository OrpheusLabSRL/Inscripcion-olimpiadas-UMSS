<?php

namespace App\Repositories\Eloquent;
use App\Repositories\Contracts\TutorRepositoryInterface;
use Illuminate\Support\Facades\DB;
use App\Models\Tutor;

class TutorRepository implements TutorRepositoryInterface
{
public function getAllWithDetails()
{
    try {
        return DB::table('tutores')
            ->leftJoin('personas', 'tutores.idPersona', '=', 'personas.idPersona')
            ->leftJoin('inscripciones', 'tutores.idPersona', '=', 'inscripciones.idTutorLegal')
            ->leftJoin('olimpistas', 'inscripciones.idOlimpista', '=', 'olimpistas.idPersona')
            ->leftJoin('personas as olimpista_persona', 'olimpistas.idPersona', '=', 'olimpista_persona.idPersona')
            ->select(
                'personas.carnetIdentidad',
                'personas.nombre',
                'personas.apellido',
                'personas.correoElectronico',
                'tutores.tipoTutor',
                'tutores.telefono',
                'olimpista_persona.carnetIdentidad as carnetOlimpista',
                'olimpista_persona.nombre as nombreOlimpista',
                'olimpista_persona.apellido as apellidoOlimpista'
            )
            ->get();
    } catch (\Exception $e) {
        \Log::error('Error in TutorRepository getAllWithDetails: ' . $e->getMessage());
        throw $e;
    }
}

public function actualizarOCrear(array $criterios, array $datos): Tutor
    {
        return Tutor::updateOrCreate($criterios, $datos);
    }

    public function buscarPorId(int $id): ?Tutor
    {
        return Tutor::find($id);
    }

    public function buscarPorPersona(int $idPersona): ?Tutor
    {
        return Tutor::where('idPersona', $idPersona)->first();
    }

    public function crear(array $datos): Tutor
    {
        return Tutor::create($datos);
    }

    public function actualizar(int $id, array $datos): bool
    {
        return Tutor::where('idTutor', $id)->update($datos);
    }
}
