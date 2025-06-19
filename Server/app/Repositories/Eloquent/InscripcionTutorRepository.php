<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\InscripcionTutorRepositoryInterface;
use App\Models\Persona;
use App\Models\Olimpista;
use App\Models\Tutor;
use Illuminate\Support\Facades\DB;

class InscripcionTutorRepository implements InscripcionTutorRepositoryInterface
{
    public function consultarOlimpista(string $carnetIdentidad, string $correoElectronico): array
    {
        $persona = Persona::where('carnetIdentidad', $carnetIdentidad)
            ->where('correoElectronico', $correoElectronico)
            ->first();
        if (!$persona) {
            return ['success' => false, 'message' => 'Olimpista no encontrado.'];
        }
        $olimpista = Olimpista::where('idPersona', $persona->idPersona)->first();
        if (!$olimpista) {
            return ['success' => false, 'message' => 'Olimpista no registrado.'];
        }
        $inscripciones = $olimpista->inscripciones()->with([
            'olimpiadaAreaCategoria.area',
            'olimpiadaAreaCategoria.categoria',
            'tutorResponsable.persona'
        ])->get();
        if ($inscripciones->isEmpty()) {
            return ['success' => false, 'message' => 'No tiene inscripciones.'];
        }
        return [
            'success' => true,
            'data' => [
                'olimpista' => [
                    'nombre' => $persona->nombre,
                    'apellido' => $persona->apellido,
                    'carnetIdentidad' => $persona->carnetIdentidad,
                    'correoElectronico' => $persona->correoElectronico,
                    'fechaNacimiento' => $olimpista->fechaNacimiento,
                    'departamento' => $olimpista->departamento,
                    'municipio' => $olimpista->municipio,
                    'curso' => $olimpista->curso,
                    'colegio' => $olimpista->colegio
                ],
                'inscripciones' => $inscripciones
            ]
        ];
    }

    public function consultarTutor(string $carnetIdentidad, string $correoElectronico): array
    {
        $persona = Persona::where('carnetIdentidad', $carnetIdentidad)
            ->where('correoElectronico', $correoElectronico)
            ->first();
        if (!$persona) {
            return ['success' => false, 'message' => 'Tutor no encontrado.'];
        }
        $tutor = Tutor::where('idPersona', $persona->idPersona)->first();
        if (!$tutor) {
            return ['success' => false, 'message' => 'Tutor no registrado.'];
        }
        $inscripcionesTutor = DB::table('inscripciones')
            ->join('olimpistas', 'inscripciones.idOlimpista', '=', 'olimpistas.idPersona')
            ->join('personas', 'olimpistas.idPersona', '=', 'personas.idPersona')
            ->join('olimpiadas_areas_categorias', 'inscripciones.idOlimpAreaCategoria', '=', 'olimpiadas_areas_categorias.idOlimpAreaCategoria')
            ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
            ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
            ->where(function ($query) use ($tutor) {
                $query->where('inscripciones.idTutorResponsable', $tutor->idPersona)
                    ->orWhere('inscripciones.idTutorLegal', $tutor->idPersona)
                    ->orWhere('inscripciones.idTutorArea', $tutor->idPersona);
            })
            ->select(
                'inscripciones.idInscripcion',
                'inscripciones.codigoInscripcion',
                'inscripciones.formaInscripcion',
                'personas.nombre',
                'personas.apellido',
                'personas.carnetIdentidad',
                'inscripciones.estadoInscripcion',
                'inscripciones.idTutorResponsable',
                'inscripciones.idTutorLegal',
                'inscripciones.idTutorArea',
                'areas.nombreArea as materia',
                'categorias.nombreCategoria as categoria'
            )
            ->get();
        if ($inscripcionesTutor->isEmpty()) {
            return ['success' => false, 'message' => 'No tiene inscripciones asociadas.'];
        }
        $olimpistas = $inscripcionesTutor->map(function ($inscripcion) use ($tutor) {
            $tiposTutor = [];
            if ($inscripcion->idTutorResponsable == $tutor->idPersona) {
                $tiposTutor[] = 'Tutor Responsable';
            }
            if ($inscripcion->idTutorLegal == $tutor->idPersona) {
                $tiposTutor[] = 'Tutor Legal';
            }
            if ($inscripcion->idTutorArea == $tutor->idPersona) {
                $tiposTutor[] = 'Tutor de Área';
            }
            return [
                'idInscripcion' => $inscripcion->idInscripcion,
                'codigoInscripcion' => $inscripcion->codigoInscripcion,
                'formaInscripcion' => $inscripcion->formaInscripcion,
                'nombre' => $inscripcion->nombre,
                'apellido' => $inscripcion->apellido,
                'carnetIdentidad' => $inscripcion->carnetIdentidad,
                'tipoTutor' => implode(', ', $tiposTutor),
                'materia' => $inscripcion->materia,
                'categoria' => $inscripcion->categoria,
                'estadoPago' => $inscripcion->estadoInscripcion == 1 ? 'PAGO REALIZADO' : 'PAGO PENDIENTE'
            ];
        });
        return [
            'success' => true,
            'data' => [
                'tutor' => [
                    'nombre' => $persona->nombre,
                    'apellido' => $persona->apellido,
                    'carnetIdentidad' => $persona->carnetIdentidad,
                    'correoElectronico' => $persona->correoElectronico,
                    'telefono' => $tutor->telefono
                ],
                'olimpistas' => $olimpistas
            ]
        ];
    }
} 