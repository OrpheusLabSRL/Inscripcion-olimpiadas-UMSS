<?php

namespace App\Http\Controllers;

use App\Models\Olimpista;
use App\Models\Tutor;
use App\Models\Persona;
use App\Models\Inscripcion_Tutor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Services\InscripcionTutorService;

class InscripcionController_Tutor extends Controller
{
    protected $inscripcionTutorService;

    public function __construct(InscripcionTutorService $inscripcionTutorService)
    {
        $this->inscripcionTutorService = $inscripcionTutorService;
    }

    public function consultar(Request $request)
    {
        $request->validate([
            'carnetIdentidad' => 'required|string',
            'correoElectronico' => 'required|email',
            'rol' => 'required|in:olimpista,tutor'
        ]);

        try {
            $result = $this->inscripcionTutorService->consultar($request->only(['carnetIdentidad', 'correoElectronico', 'rol']));
            return response()->json($result, $result['success'] ? 200 : 404);
        } catch (\Exception $e) {
            \Log::error('Error en consultar:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar la inscripción: ' . $e->getMessage()
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