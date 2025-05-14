<?php

namespace App\Http\Controllers;

use App\Models\Olimpista;
use App\Models\Tutor;
use App\Models\Persona;
use App\Models\Inscripcion_Tutor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class InscripcionController_Tutor extends Controller
{
    public function consultar(Request $request)
    {
        $request->validate([
            'carnetIdentidad' => 'required|string',
            'correoElectronico' => 'required|email',
            'rol' => 'required|in:olimpista,tutor'
        ]);

        try {
            $carnetIdentidad = $request->input('carnetIdentidad');
            $correoElectronico = $request->input('correoElectronico');
            $rol = $request->input('rol');

            Log::info('Datos de consulta:', compact('carnetIdentidad', 'correoElectronico', 'rol'));

            if ($rol === 'olimpista') {
                $persona = Persona::where('carnetIdentidad', $carnetIdentidad)
                                  ->where('correoElectronico', $correoElectronico)
                                  ->first();

                if (!$persona) {
                    return response()->json(['success' => false, 'message' => 'Olimpista no encontrado.']);
                }

                $olimpista = Olimpista::where('idPersona', $persona->idPersona)->first();
                if (!$olimpista) {
                    return response()->json(['success' => false, 'message' => 'Olimpista no registrado.']);
                }

                $inscripciones = Inscripcion::with([
                        'olimpiadaAreaCategoria.area',
                        'olimpiadaAreaCategoria.categoria',
                        'tutorResponsable.persona'
                    ])
                    ->where('idOlimpista', $olimpista->idOlimpista)
                    ->get();

                if ($inscripciones->isEmpty()) {
                    return response()->json(['success' => false, 'message' => 'No tiene inscripciones.']);
                }

                // Cada inscripción se trata como un olimpista individual
                $olimpistas = $inscripciones->map(function ($inscripcion) use ($persona, $olimpista) {
                    return [
                        'idInscripcion' => $inscripcion->idInscripcion,
                        'nombre' => $persona->nombre,
                        'apellido' => $persona->apellido,
                        'carnetIdentidad' => $persona->carnetIdentidad,
                        'correoElectronico' => $persona->correoElectronico,
                        'fechaNacimiento' => $olimpista->fechaNacimiento,
                        'departamento' => $olimpista->departamento,
                        'municipio' => $olimpista->municipio,
                        'curso' => $olimpista->curso,
                        'colegio' => $olimpista->colegio,
                        'estadoPago' => $inscripcion->estadoInscripcion == 1 ? 'PAGO REALIZADO' : 'PAGO PENDIENTE',
                        'area' => $inscripcion->olimpiadaAreaCategoria->area->nombreArea ?? null,
                        'categoria' => $inscripcion->olimpiadaAreaCategoria->categoria->nombreCategoria ?? null,
                        'tutorResponsable' => $inscripcion->tutorResponsable ? [
                            'nombre' => $inscripcion->tutorResponsable->persona->nombre,
                            'apellido' => $inscripcion->tutorResponsable->persona->apellido,
                            'correoElectronico' => $inscripcion->tutorResponsable->persona->correoElectronico,
                            'telefono' => $inscripcion->tutorResponsable->telefono,
                        ] : null,
                    ];
                });

                return response()->json([
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
                ]);
                
            } else {
                // Es tutor
                Log::info('Buscando tutor con:', [
                    'carnetIdentidad' => $carnetIdentidad,
                    'correoElectronico' => $correoElectronico
                ]);

                // Primero buscar en la tabla personas
                $persona = Persona::where('carnetIdentidad', $carnetIdentidad)
                                  ->where('correoElectronico', $correoElectronico)
                                  ->first();

                if (!$persona) {
                    Log::warning('Persona no encontrada para tutor');
                    return response()->json(['success' => false, 'message' => 'Tutor no encontrado.']);
                }

                // Buscar en la tabla tutores
                $tutor = Tutor::where('idPersona', $persona->idPersona)->first();
                
                if (!$tutor) {
                    Log::warning('Tutor no encontrado en la tabla tutores');
                    return response()->json(['success' => false, 'message' => 'Tutor no registrado.']);
                }

                // Buscar todas las inscripciones donde este tutor aparece
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

                Log::info('Resultados de la consulta:', ['data' => $inscripcionesTutor]);

                if ($inscripcionesTutor->isEmpty()) {
                    return response()->json(['success' => false, 'message' => 'No tiene inscripciones asociadas.']);
                }

                // Procesar cada inscripción
                $olimpistas = $inscripcionesTutor->map(function ($inscripcion) use ($tutor) {
                    // Determinar el tipo de tutor
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

                Log::info('Datos finales enviados:', ['olimpistas' => $olimpistas]);

                $response = [
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

                Log::info('Respuesta final:', ['response' => $response]);

                return response()->json($response);
            }
        } catch (\Exception $e) {
            Log::error('Error en consultar:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error interno: ' . $e->getMessage()
            ], 500);
        }
    }

    public function consultarInscripcion(Request $request)
    {
        try {
            $ci = $request->input('ci');
            $correo = $request->input('correo');
            $rol = $request->input('rol');

            $query = DB::table('inscripciones as i')
                ->join('tutores as t', 'i.tutor_id', '=', 't.id')
                ->join('olimpistas as o', 'i.olimpista_id', '=', 'o.id')
                ->where('t.ci', $ci)
                ->where('t.correo', $correo)
                ->where('t.rol', $rol)
                ->select(
                    'i.codigoInscripcion',
                    't.nombre as nombreTutor',
                    't.ci as ciTutor',
                    't.correo as correoTutor',
                    'o.nombre',
                    'o.ci',
                    'o.fechaNacimiento',
                    'o.departamento',
                    'o.municipio',
                    'o.curso',
                    'o.colegio'
                );

            $resultados = $query->get();

            if ($resultados->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron inscripciones para los datos proporcionados'
                ], 404);
            }

            // Agrupar los resultados por código de inscripción
            $inscripcionesAgrupadas = $resultados->groupBy('codigoInscripcion')->map(function ($grupo) {
                $primerRegistro = $grupo->first();
                return [
                    'codigoInscripcion' => $primerRegistro->codigoInscripcion,
                    'tutor' => [
                        'nombre' => $primerRegistro->nombreTutor,
                        'ci' => $primerRegistro->ciTutor,
                        'correo' => $primerRegistro->correoTutor
                    ],
                    'olimpistas' => $grupo->map(function ($item) {
                        return [
                            'nombre' => $item->nombre,
                            'ci' => $item->ci,
                            'fechaNacimiento' => $item->fechaNacimiento,
                            'departamento' => $item->departamento,
                            'municipio' => $item->municipio,
                            'curso' => $item->curso,
                            'colegio' => $item->colegio
                        ];
                    })->values()
                ];
            })->values();

            return response()->json([
                'success' => true,
                'data' => $inscripcionesAgrupadas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar la inscripción: ' . $e->getMessage()
            ], 500);
        }
    }
}