<?php

namespace App\Http\Controllers;

use App\Http\Controllers\MailController;
use App\Services\GenerarBoletaService;
use App\Services\VerificarPagoService;
use App\Services\ConfirmarPagoService;
use App\Services\ReimprimirBoletaService;
use App\Services\ObtenerBoletasPorTutorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BoletaPagoController extends Controller
{
    protected $mailController;
    protected $generarBoletaService;
    protected $verificarPagoService;
    protected $confirmarPagoService;
    protected $reimprimirBoletaService;
    protected $obtenerBoletasPorTutorService;

    public function __construct(
        MailController $mailController,
        GenerarBoletaService $generarBoletaService,
        VerificarPagoService $verificarPagoService,
        ConfirmarPagoService $confirmarPagoService,
        ReimprimirBoletaService $reimprimirBoletaService,
        ObtenerBoletasPorTutorService $obtenerBoletasPorTutorService
    ) {
        $this->mailController = $mailController;
        $this->generarBoletaService = $generarBoletaService;
        $this->verificarPagoService = $verificarPagoService;
        $this->confirmarPagoService = $confirmarPagoService;
        $this->reimprimirBoletaService = $reimprimirBoletaService;
        $this->obtenerBoletasPorTutorService = $obtenerBoletasPorTutorService;
    }

    public function obtenerDatosBoleta($codigoInscripcion, $idTutor)
    {
        try {
            // 1. Obtener datos del tutor
            $tutor = DB::table('tutores')
                ->join('personas', 'tutores.idPersona', '=', 'personas.idPersona')
                ->where('tutores.idPersona', $idTutor)
                ->select('personas.nombre', 'personas.apellido', 'personas.carnetIdentidad', 'tutores.telefono')
                ->first();

            if (!$tutor) {
                return response()->json(['message' => 'Tutor no encontrado'], 404);
            }

            // 2. Obtener datos de la inscripción
            $inscripcion = DB::table('inscripciones')
                ->where('codigoInscripcion', $codigoInscripcion)
                ->first();

            if (!$inscripcion) {
                return response()->json(['message' => 'Inscripción no encontrada'], 404);
            }

            // 3. Obtener TODOS los olimpistas asociados a esta inscripción
            $olimpistas = DB::table('inscripciones')
                ->join('olimpistas', 'inscripciones.idOlimpista', '=', 'olimpistas.idPersona')
                ->join('personas', 'olimpistas.idPersona', '=', 'personas.idPersona')
                ->where('inscripciones.codigoInscripcion', $codigoInscripcion)
                ->select(
                    'personas.nombre',
                    'personas.apellido',
                    'personas.carnetIdentidad',
                    'olimpistas.curso',
                    'olimpistas.colegio'
                )
                ->get();

            if ($olimpistas->isEmpty()) {
                return response()->json(['message' => 'No se encontraron olimpistas para esta inscripción'], 404);
            }

            // 4. Obtener datos del área, categoría y costo
            $areaCategoria = DB::table('olimpiadas_areas_categorias')
                ->join('areas', 'olimpiadas_areas_categorias.idArea', '=', 'areas.idArea')
                ->join('categorias', 'olimpiadas_areas_categorias.idCategoria', '=', 'categorias.idCategoria')
                ->where('olimpiadas_areas_categorias.idOlimpAreaCategoria', $inscripcion->idOlimpAreaCategoria)
                ->select(
                    'areas.nombreArea as area',
                    'categorias.nombreCategoria as categoria',
                    'olimpiadas_areas_categorias.costo'
                )
                ->first();

            // 5. Obtener datos de la olimpiada
            $olimpiada = DB::table('olimpiadas')
                ->where('idOlimpiada', function($query) use ($inscripcion) {
                    $query->select('idOlimpiada')
                        ->from('olimpiadas_areas_categorias')
                        ->where('idOlimpAreaCategoria', $inscripcion->idOlimpAreaCategoria);
                })
                ->select('nombreOlimpiada', 'version')
                ->first();

            // 6. Obtener datos de la boleta de pago (si existe)
            $boleta = $inscripcion->codigoBoleta ? DB::table('boletas_pagos')
                ->where('codigoBoleta', $inscripcion->codigoBoleta)
                ->select('codigoBoleta', 'fechaEmision', 'montoTotal', 'fechaPago', 'numeroControl')
                ->first() : null;

            // 7. Calcular total
            $total = $areaCategoria->costo * $olimpistas->count();

            // Construir respuesta
            $response = [
                'universidad' => 'UNIVERSIDAD MAYOR DE SAN SIMÓN',
                'facultad' => 'FACULTAD DE CIENCIAS Y TECNOLOGÍA',
                'secretaria' => 'SECRETARÍA ADMINISTRATIVA',
                'tutor' => [
                    'nombre_completo' => $tutor->nombre . ' ' . $tutor->apellido,
                    'ci' => $tutor->carnetIdentidad,
                    'telefono' => $tutor->telefono
                ],
                'inscripcion' => [
                    'codigo' => $inscripcion->codigoInscripcion,
                    'fecha' => $inscripcion->created_at,
                    'codigo_boleta' => $boleta ? str_pad($boleta->codigoBoleta, 4, '0', STR_PAD_LEFT) : null,
                    'numero_control' => $boleta ? $boleta->numeroControl : null
                ],
                'olimpistas' => $olimpistas->map(function($olimpista) {
                    return [
                        'nombre_completo' => $olimpista->nombre . ' ' . $olimpista->apellido,
                        'ci' => $olimpista->carnetIdentidad,
                        'curso' => $olimpista->curso,
                        'colegio' => $olimpista->colegio
                    ];
                }),
                'area' => [
                    'nombre' => $areaCategoria->area,
                    'categoria' => $areaCategoria->categoria,
                    'costo_unitario' => (float)$areaCategoria->costo
                ],
                'olimpiada' => [
                    'nombre' => $olimpiada->nombreOlimpiada,
                    'version' => $olimpiada->version
                ],
                'total' => [
                    'monto' => $total,
                    'cantidad_estudiantes' => $olimpistas->count(),
                ],
                'fecha_actual' => now()->format('d \\d\\e F \\d\\e Y')
            ];

            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Error al obtener datos para boleta: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener datos para la boleta'], 500);
        }
    }

    public function generarBoleta($idTutor, $codigoInscripcion)
    {
        try {
            // Primero verificamos si ya existe una boleta para esta inscripción
            $inscripcion = DB::table('inscripciones')
                ->where('codigoInscripcion', $codigoInscripcion)
                ->first();

            if (!$inscripcion) {
                return response()->json(['message' => 'Inscripción no encontrada'], 404);
            }

            // Si no tiene boleta asignada, generamos una nueva
            if (!$inscripcion->codigoBoleta) {
                // Usamos el servicio para generar la boleta
                $this->generarBoletaService->generarBoleta($idTutor, $codigoInscripcion);
            }

            // Finalmente obtenemos y devolvemos los datos actualizados
            return $this->obtenerDatosBoleta($codigoInscripcion, $idTutor);

        } catch (\Exception $e) {
            Log::error('Error al generar la boleta: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al generar la boleta.'], 500);
        }
    }

    public function generarPago(Request $request)
    {
        $numeroControlRaw = $request->input('numeroControl');
        $result = $this->verificarPagoService->verificarPago($numeroControlRaw);
        return response()->json($result);
    }

    public function confirmarPago(Request $request)
    {
        $numeroControlRaw = $request->input('numeroControl');
        try {
            $message = $this->confirmarPagoService->confirmarPago($numeroControlRaw, $this->mailController);
            return response()->json(['message' => $message]);
        } catch (\Exception $e) {
            Log::error('Error al confirmar el pago: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al confirmar el pago.'], 500);
        }
    }

    public function getBoletasPorTutor($tutorId)
    {
        try {
            $boletas = $this->obtenerBoletasPorTutorService->obtenerBoletasPorTutor($tutorId);
            return response()->json(['boletas' => $boletas]);
        } catch (\Exception $e) {
            Log::error('Error al obtener boletas por tutor: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener boletas.'], 500);
        }
    }

    public function reimprimirBoleta($codigoBoleta)
    {
        try {
            Log::info('Recibida solicitud de reimpresión para boleta: ' . $codigoBoleta);
            
            $pdf = $this->reimprimirBoletaService->reimprimirBoleta($codigoBoleta);
            Log::info('PDF generado correctamente para boleta: ' . $codigoBoleta);
            
            return $pdf->stream("boleta_pago_{$codigoBoleta}.pdf");
        } catch (\Exception $e) {
            Log::error('Error al reimprimir la boleta: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error interno al reimprimir la boleta.'], 500);
        }
    }
}