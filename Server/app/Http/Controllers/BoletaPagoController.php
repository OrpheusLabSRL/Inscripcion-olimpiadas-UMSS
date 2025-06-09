<?php

namespace App\Http\Controllers;

use App\Http\Controllers\MailController;
use App\Services\GenerarBoletaService;
use App\Services\VerificarPagoService;
use App\Services\ConfirmarPagoService;
use App\Services\ReimprimirBoletaService;
use App\Services\ObtenerBoletasPorTutorService;
use Illuminate\Http\Request;

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

    public function generarBoleta($idTutor, $codigoInscripcion)
    {
        try {
            $pdf = $this->generarBoletaService->generarBoleta($idTutor, $codigoInscripcion);
            return $pdf->download("boleta_pago_{$idTutor}_{$codigoInscripcion}.pdf");
        } catch (\Exception $e) {
            \Log::error('Error al generar la boleta: ' . $e->getMessage());
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
            \Log::error('Error al confirmar el pago: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al confirmar el pago.'], 500);
        }
    }

    public function getBoletasPorTutor($tutorId)
    {
        try {
            $boletas = $this->obtenerBoletasPorTutorService->obtenerBoletasPorTutor($tutorId);
            return response()->json(['boletas' => $boletas]);
        } catch (\Exception $e) {
            \Log::error('Error al obtener boletas por tutor: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno al obtener boletas.'], 500);
        }
    }

    public function reimprimirBoleta($codigoBoleta)
    {
        try {
            \Log::info('Recibida solicitud de reimpresión para boleta: ' . $codigoBoleta);
            
            $pdf = $this->reimprimirBoletaService->reimprimirBoleta($codigoBoleta);
            \Log::info('PDF generado correctamente para boleta: ' . $codigoBoleta);
            
            return $pdf->stream("boleta_pago_{$codigoBoleta}.pdf");
        } catch (\Exception $e) {
            \Log::error('Error al reimprimir la boleta: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error interno al reimprimir la boleta.'], 500);
        }
    }
}
