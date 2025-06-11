<?php

namespace App\Http\Controllers;

use App\Http\Controllers\MailController;
use App\Services\VerificarPagoService;
use App\Services\ConfirmarPagoService;
use App\Services\ObtenerBoletasPorTutorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BoletaPagoController extends Controller
{
    protected $mailController;
    protected $verificarPagoService;
    protected $confirmarPagoService;
    protected $obtenerBoletasPorTutorService;

    public function __construct(
        MailController $mailController,
        VerificarPagoService $verificarPagoService,
        ConfirmarPagoService $confirmarPagoService,
        ObtenerBoletasPorTutorService $obtenerBoletasPorTutorService
    ) {
        $this->mailController = $mailController;
        $this->verificarPagoService = $verificarPagoService;
        $this->confirmarPagoService = $confirmarPagoService;
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

            // 6. Obtener datos de la boleta de pago
            $boleta = DB::table('boletas_pagos')
                ->where('codigoBoleta', $inscripcion->codigoBoleta)
                ->select('codigoBoleta', 'fechaEmision', 'montoTotal', 'fechaPago', 'numeroControl')
                ->first();

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
                    'codigo_boleta' => $boleta ? str_pad($boleta->codigoBoleta, 4, '0', STR_PAD_LEFT) : '0000'
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
                'total' => [
                    'monto' => $total,
                    'cantidad_estudiantes' => $olimpistas->count(),
                ],
                'fecha_actual' => now()->format('d \\d\\e F \\d\\e Y')
            ];

            return response()->json($response);

        } catch (\Exception $e) {
            \Log::error('Error al obtener datos para boleta: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener datos para la boleta'], 500);
        }
    }

    public function generarBoleta($idTutor, $codigoInscripcion)
    {
        try {
            // 1. Verificar si ya existe una boleta para esta inscripción
            $inscripcion = DB::table('inscripciones')
                ->where('codigoInscripcion', $codigoInscripcion)
                ->first();

            if (!$inscripcion) {
                return response()->json(['message' => 'Inscripción no encontrada'], 404);
            }

            // 2. Si no tiene boleta asignada, crear una nueva
            if (!$inscripcion->codigoBoleta) {
                DB::beginTransaction();

                try {
                    // Calcular monto total (necesitas implementar esta lógica según tu estructura)
                    $montoTotal = $this->calcularMontoTotal($codigoInscripcion);

                    // Crear nueva boleta
                    $codigoBoleta = DB::table('boletas_pagos')->insertGetId([
                        'idTutor' => $idTutor,
                        'fechaEmision' => now()->format('Y-m-d'),
                        'montoTotal' => $montoTotal,
                        'estadoBoletaPago' => true,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    // Actualizar la inscripción con el código de boleta
                    DB::table('inscripciones')
                        ->where('codigoInscripcion', $codigoInscripcion)
                        ->update(['codigoBoleta' => $codigoBoleta]);

                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            }

            // 3. Generar y devolver el PDF
            $pdf = $this->generarPDF($codigoInscripcion, $idTutor);
            return $pdf->download("boleta_pago_{$codigoInscripcion}.pdf");

        } catch (\Exception $e) {
            \Log::error('Error al generar la boleta: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al generar la boleta.'], 500);
        }
    }

    private function calcularMontoTotal($codigoInscripcion)
    {
        // Implementa la lógica para calcular el monto total basado en:
        // - Número de estudiantes
        // - Costo por área/categoría
        // Puedes usar una consulta similar a la de obtenerDatosBoleta
        
        $inscripcion = DB::table('inscripciones')
            ->where('codigoInscripcion', $codigoInscripcion)
            ->first();

        $areaCategoria = DB::table('olimpiadas_areas_categorias')
            ->where('idOlimpAreaCategoria', $inscripcion->idOlimpAreaCategoria)
            ->first();

        $cantidadEstudiantes = DB::table('inscripciones')
            ->where('codigoInscripcion', $codigoInscripcion)
            ->count();

        return $areaCategoria->costo * $cantidadEstudiantes;
    }

    private function generarPDF($codigoInscripcion, $idTutor)
    {
        // Implementa la generación del PDF usando los mismos datos que en obtenerDatosBoleta
        // Puedes usar DomPDF, TCPDF, o cualquier otra librería
        
        $data = $this->obtenerDatosBoleta($codigoInscripcion, $idTutor);
        $data = $data->getData(true); // Obtener los datos como array
        
        // Aquí iría el código para generar el PDF
        // Ejemplo con DomPDF:
        /*
        $pdf = \PDF::loadView('boleta_pago', $data);
        return $pdf;
        */
        
        // Por ahora devolvemos un response simple para pruebas
        return response()->make('PDF generado', 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="boleta.pdf"'
        ]);
    }

    // Resto de métodos mantenidos...
    public function generarPago(Request $request) { /* ... */ }
    public function confirmarPago(Request $request) { /* ... */ }
    public function getBoletasPorTutor($tutorId) { /* ... */ }
}