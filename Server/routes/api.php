<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\OlimpistaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\TutorController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/hola', [OlimpiadaController::class, 'mostrarOlimpiada']);
Route::post('/register', [OlimpistaController::class, 'store']);
Route::get('/tutor/{id_tutor}/estudiantes', [TutorController::class, 'getEstudiantes']);
Route::get('/catalogoCompleto', [AreaController::class, 'getProgramaCompleto']);
Route::post('/newInscription', [InscripcionController::class, 'store']);
Route::get('/olimpista/{id}/areas', [InscripcionController::class, 'getAreaByOlimpista']);

// New Tutor Routes
Route::post('/tutores', [TutorController::class, 'store']);
Route::get('/tutores/verificar', [TutorController::class, 'checkExistingTutor']);