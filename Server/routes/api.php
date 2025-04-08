<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\OlimpistaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\GradoController;

use App\Http\Controllers\TutorController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/hola', [OlimpiadaController::class, 'mostrarOlimpiada']);
Route::post('/register', [OlimpistaController::class, 'store']);
Route::get('/areas', [AreaController::class, 'index']);
Route::post('/registerAreas', [AreaController::class, 'store']);
Route::get('/categorias', [CategoriaController::class, 'index']);         // Listar todas
Route::post('/categorias', [CategoriaController::class, 'store']);        // Crear nueva
Route::get('/categorias/{id}', [CategoriaController::class, 'show']);     // Ver una específica
Route::put('/categorias/{id}', [CategoriaController::class, 'update']);   // Actualizar
Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']); // Eliminar
Route::post('/registrarOlimpiadas', [OlimpiadaController::class, 'store']);

Route::prefix('categorias')->group(function () {
    Route::get('/', [CategoriaController::class, 'index']);            // Listar todas
    Route::get('/{id}', [CategoriaController::class, 'show']);         // Obtener por ID
    Route::post('/', [CategoriaController::class, 'store']);           // Crear
    Route::put('/{id}', [CategoriaController::class, 'update']);       // Actualizar
    Route::delete('/{id}', [CategoriaController::class, 'destroy']);   // Eliminar
});

Route::prefix('grados')->controller(GradoController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});
Route::get('/tutor/{id_tutor}/estudiantes', [TutorController::class, 'getEstudiantes']);
Route::get('/catalogoCompleto', [AreaController::class, 'getProgramaCompleto']);
Route::post('/newInscription', [InscripcionController::class, 'store']);
Route::get('/olimpista/{id}/areas', [InscripcionController::class, 'getAreaByOlimpista']);

// New Tutor Routes
Route::post('/tutores', [TutorController::class, 'store']);
Route::get('/tutores/verificar', [TutorController::class, 'checkExistingTutor']);
