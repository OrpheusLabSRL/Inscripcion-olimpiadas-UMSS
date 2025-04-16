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
use App\Http\Controllers\OlimpiadaAreaController;
use App\Http\Controllers\AreaCategoriaController;
use App\Http\Controllers\CategoriaGradoController;

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
Route::post('/asignar-olimpiada', [OlimpiadaController::class, 'asignarAreasYCategorias']);

// Áreas
Route::get('/areas', [AreaController::class, 'index']);
Route::post('/registerAreas', [AreaController::class, 'store']);
Route::get('/catalogoCompleto', [AreaController::class, 'getProgramaCompleto']);

// Categorías (CRUD completo agrupado)
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

// Grados (CRUD completo agrupado)
Route::get('/grados', [GradoController::class, 'index']);
Route::get('/grados/{id}', [GradoController::class, 'show']);
Route::post('/grados', [GradoController::class, 'store']);
Route::put('/grados/{id}', [GradoController::class, 'update']);
Route::delete('/grados/{id}', [GradoController::class, 'destroy']);

// Inscripción de estudiante a olimpiada
Route::post('/newInscription', [InscripcionController::class, 'store']);

// Tabla intermedia: Olimpiada-Area
Route::get('/olimpiada-area', [OlimpiadaAreaController::class, 'index']);
Route::get('/olimpiada-area/{id}', [OlimpiadaAreaController::class, 'show']);
Route::post('/olimpiada-area', [OlimpiadaAreaController::class, 'store']);
Route::put('/olimpiada-area/{id}', [OlimpiadaAreaController::class, 'update']);
Route::delete('/olimpiada-area/{id}', [OlimpiadaAreaController::class, 'destroy']);

// Tabla intermedia: Area-Categoria
Route::get('/area-categoria', [AreaCategoriaController::class, 'index']);
Route::get('/area-categoria/{id}', [AreaCategoriaController::class, 'show']);
Route::post('/area-categoria', [AreaCategoriaController::class, 'store']);
Route::put('/area-categoria/{id}', [AreaCategoriaController::class, 'update']);
Route::delete('/area-categoria/{id}', [AreaCategoriaController::class, 'destroy']);

// Tabla intermedia: Categoria-Grado
Route::get('/categoria-grado', [CategoriaGradoController::class, 'index']);
Route::get('/categoria-grado/{id}', [CategoriaGradoController::class, 'show']);
Route::post('/categoria-grado', [CategoriaGradoController::class, 'store']);
Route::put('/categoria-grado/{id}', [CategoriaGradoController::class, 'update']);
Route::delete('/categoria-grado/{id}', [CategoriaGradoController::class, 'destroy']);
