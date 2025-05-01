<?php

namespace App\Http\Controllers;


use App\Models\Inscripcion;
use Illuminate\Http\Request;
use App\Models\Olimpista;
use Illuminate\Support\Facades\Log;

class OlimpistaController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    Log::info('Datos del Request:', $request->all());

    $olimpista = Olimpista::create([
        'correo' => $request->Email,
        'apellido' => $request->Apellido,
        'Nombre' => $request->Nombre,
        'carnetIdentidad' => $request->CarnetIdentidad,
        'curso' => $request->Curso,
        'fechaNacimiento' => $request->FechaNacimiento,
        'colegio' => $request->Colegio,
        'departamento' => $request->Departamento,
        'provincia' => $request->Provincia,
    ]);
    
    $olimpista->tutores()->attach($request->id_tutor);

    return response()->json([
        'message' => 'Olimpista creado exitosamente',
        'data' => $olimpista
    ], 201);
}

public function getOlimpistasByTutor($idTutorResponsable)
{
    try {
        $inscripciones = Inscripcion::with([
            'olimpista.persona',
            'tutorArea.persona',
            'olimpiadaAreaCategoria.area',
            'olimpiadaAreaCategoria.categoria'
        ])
        ->where('idTutorResponsable', $idTutorResponsable)
        ->get();

        if ($inscripciones->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No se encontraron olimpistas para este tutor',
                'data' => []
            ], 200);
        }

        $olimpistasAgrupados = $inscripciones->groupBy('idOlimpista');

        $resultado = $olimpistasAgrupados->map(function ($inscripcionesGrupo) {
            $primeraInscripcion = $inscripcionesGrupo->first();
            $olimpista = $primeraInscripcion->olimpista;
            $persona = $olimpista->persona;

            $areas = $inscripcionesGrupo->map(function ($inscripcion) {
                return [
                    'id_inscripcion' => $inscripcion->idInscripcion,
                    'nombre_area' => $inscripcion->olimpiadaAreaCategoria->area->nombreArea ?? null,
                    'nombre_categoria' => $inscripcion->olimpiadaAreaCategoria->categoria->nombreCategoria ?? null,
                    'nombre_tutor_area' => $inscripcion->tutorArea->persona->nombre ?? null,
                    'apellido_tutor_area' => $inscripcion->tutorArea->persona->apellido ?? null,
                    'telefono' => $inscripcion->tutorArea->telefono ?? null,
                    'tipo_tutor' => $inscripcion->tutorArea->tipoTutor ?? null,
                    'carnetIdentidad' => $inscripcion->tutorArea->persona->carnetIdentidad ?? null,
                    'correo' => $inscripcion->tutorArea->persona->correoElectronico ?? null,
                ];
            });

            return [
                'id_olimpista' => $olimpista->idPersona,
                'nombre' => $persona->nombre,
                'apellido' => $persona->apellido,
                'curso' => $olimpista->curso,
                'colegio' => $olimpista->colegio,
                'carnetIdentidad' => $persona->carnetIdentidad,
                'fechaNacimiento' => $olimpista->fechaNacimiento,
                'departamento' => $olimpista->departamento,
                'provincia' => $olimpista->provincia,
                'correo' => $persona->correoElectronico,
                'areas' => $areas,
                'total_areas' => $areas->count()
            ];
        })->values();

        return response()->json([
            'success' => true,
            'total_olimpistas' => $resultado->count(),
            'data' => $resultado
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los olimpistas',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function getAllOlimpistas()
    {
        try {
            // Join with personas, inscripciones, olimpiadas_areas_categorias, areas, categorias, aulas, grados
            $olimpistas = \DB::table('olimpistas')
                ->leftJoin('personas', 'olimpistas.idPersona', '=', 'personas.idPersona')
                ->leftJoin('inscripciones', 'olimpistas.idPersona', '=', 'inscripciones.idOlimpista')
                ->leftJoin('olimpiadas_areas_categorias', 'inscripciones.idOlimpAreaCategoria', '=', 'olimpiadas_areas_categorias.idOlimpAreaCategoria')
                ->leftJoin('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
                ->leftJoin('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
                // Removed join with aulas due to missing column inscripciones.idAula
                // ->leftJoin('aulas', 'inscripciones.idAula', '=', 'aulas.id')
                // Removed join with grados as per instruction
                ->select(
                    'personas.carnetIdentidad as carnetDeIdentidad',
                    'personas.nombre',
                    'personas.apellido',
                    'olimpistas.fechaNacimiento',
                    'olimpistas.departamento',
                    'olimpistas.curso',
                    'olimpistas.colegio',
                    'areas.nombreArea',
                    'categorias.nombreCategoria as nombreCategoria',
                    //'grados.nombreGrado as grado', // removed
                    //'aulas.nombreAula' // removed due to missing join
                )
                ->distinct()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $olimpistas
            ]);
        } catch (\Exception $e) {
            \Log::error('Error en getAllOlimpistas: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener todos los olimpistas con detalles',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}
