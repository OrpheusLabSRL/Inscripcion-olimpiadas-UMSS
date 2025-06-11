
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentConfirmationMail;
use App\Models\Tutor;
use App\Models\BoletaPago;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\BoletaPagoController;

Route::get('/test-email', function () {
    // For testing, get a tutor and boletaPago to send test email
    $tutor = Tutor::first();
    $boleta = BoletaPago::first();

    if (!$tutor || !$boleta) {
        return 'Tutor or BoletaPago not found in database.';
    }

    try {
        Mail::to($tutor->correoElectronico)->send(new PaymentConfirmationMail($boleta, $tutor));
        return 'Test email sent successfully to ' . $tutor->correoElectronico;
    } catch (\Exception $e) {
        return 'Error sending test email: ' . $e->getMessage();
    }
});

Route::get('/boletas/generar/{idTutor}/{codigoInscripcion}', [BoletaPagoController::class, 'generarBoleta']);



Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');



//rutas para olimpiada
Route::get('/', [OlimpiadaController::class, 'formularioOlimpiada'])->name('olimpiada.mostrar');
Route::post('/',[OlimpiadaController::class,'agregarOlimpiada'])->name('olimpiada.agregar');
//falta editar u eliminar


//rutas para areas
Route::get('/area', [AreaController::class, 'mostrarArea'])->name('area.mostrar');
Route::post('/area', [AreaController::class, 'agregarArea'])->name('area.agregar');

