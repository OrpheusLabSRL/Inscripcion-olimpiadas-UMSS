<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\BoletaPagoController;


Route::get('/boletas/generar/{idTutor}/{codigoInscripcion}', [BoletaPagoController::class, 'generarBoleta']);


//rutas para olimpiada
Route::get('/', [OlimpiadaController::class, 'formularioOlimpiada'])->name('olimpiada.mostrar');
Route::post('/',[OlimpiadaController::class,'agregarOlimpiada'])->name('olimpiada.agregar');
//falta editar u eliminar


//rutas para areas
Route::get('/area', [AreaController::class, 'mostrarArea'])->name('area.mostrar');
Route::post('/area', [AreaController::class, 'agregarArea'])->name('area.agregar');

