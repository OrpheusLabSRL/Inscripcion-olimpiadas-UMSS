<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AreaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\GradoController;
use App\Http\Controllers\InformacionContactoController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\OlimpistaController;
use App\Http\Controllers\TutorController;

// Ruta protegida para obtener el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Rutas para Olimpistas (Estudiantes)
Route::post('/register', [OlimpistaController::class, 'store']);
Route::get('/olimpista/{id}/areas', [InscripcionController::class, 'getAreaByOlimpista']);
Route::get('/olimpista/{id}/tutores', [TutorController::class, 'getTutoresByOlimpista']);


// Rutas para Tutores
Route::post('/tutores', [TutorController::class, 'store']);
Route::get('/tutor/{id_tutor}/estudiantes', [TutorController::class, 'getEstudiantes']);
Route::get('/tutores/verificar', [TutorController::class, 'checkExistingTutor']);


// Información de Contacto
Route::post('/contacto', [InformacionContactoController::class, 'store']);


// Rutas para Olimpiadas
Route::get('/hola', [OlimpiadaController::class, 'mostrarOlimpiada']);
Route::post('/registrarOlimpiadas', [OlimpiadaController::class, 'store']);


// Áreas
Route::get('/areas', [AreaController::class, 'index']);
Route::post('/registerAreas', [AreaController::class, 'store']);
Route::get('/catalogoCompleto', [AreaController::class, 'getProgramaCompleto']);


//Categorías (CRUD completo agrupado)
Route::prefix('categorias')->controller(CategoriaController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});


// Grados (CRUD completo agrupado)
Route::prefix('grados')->controller(GradoController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});


// Inscripción de estudiante a olimpiada
Route::post('/newInscription', [InscripcionController::class, 'store']);
