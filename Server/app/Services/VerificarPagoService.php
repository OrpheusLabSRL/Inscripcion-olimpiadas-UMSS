<?php

namespace App\Services;

use App\Models\BoletaPago;
use Illuminate\Support\Facades\Log;

class VerificarPagoService
{
    public function verificarPago($numeroControlRaw)
    {
        if (!$numeroControlRaw || !preg_match('/(\d+)/', $numeroControlRaw, $matches)) {
            return ['exists' => false, 'paid' => false];
        }
        $numeroControl = $matches[1];
        Log::info('Verificando numeroControl: ' . $numeroControl);

        if (!$numeroControl) {
            return ['exists' => false, 'paid' => false];
        }

        $boleta = BoletaPago::where('numeroControl', $numeroControl)->first();

        if (!$boleta) {
            return ['exists' => false, 'paid' => false];
        }

        $isPaid = $boleta->estadoBoletaPago == 0;

        return ['exists' => true, 'paid' => $isPaid];
    }
}
