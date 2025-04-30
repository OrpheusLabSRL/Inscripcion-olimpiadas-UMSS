<?php

use App\Http\Controllers\PersonaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AreaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\GradoController;
use App\Http\Controllers\InformacionContactoController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\InscripcionController_Tutor;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\OlimpistaController;
use App\Http\Controllers\TutorController;
use App\Http\Controllers\CategoriaGradoController;
use App\Http\Controllers\OlimpiadaAreaCategoriaController;
use App\Http\Controllers\ContactoController;

// Ruta protegida para obtener el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas para Persona
Route::get('/persona/{carnet}/data', [PersonaController::class, 'getPersonData']);

// Rutas para Olimpistas (Estudiantes)
Route::post('/register', [OlimpistaController::class, 'store']);
Route::get('/olimpista/{id}/areas', [InscripcionController::class, 'getAreaByOlimpista']);
Route::get('/olimpista/{carnet_identidad}/habilitado', [InscripcionController::class, 'enableForIncription']);
Route::get('/olimpista/{id}/tutores', [TutorController::class, 'getTutoresByOlimpista']);

// Rutas para Tutores
Route::post('/tutores', [TutorController::class, 'store']);
Route::get('/tutor/{id_tutor}/estudiantes', [OlimpistaController::class, 'getOlimpistasByTutor']);
Route::get('/tutores/verificar', [TutorController::class, 'checkExistingTutor']);
Route::get('/tutor/{id}', [TutorController::class, 'getTutorWithPersona']);

// Información de Contacto
Route::post('/contacto', [InformacionContactoController::class, 'store']);

// Rutas para Olimpiadas
Route::get('/viewOlimpiadas', [OlimpiadaController::class, 'mostrarOlimpiada']);
Route::post('/registrarOlimpiadas', [OlimpiadaController::class, 'store']);

// Áreas
Route::get('/viewAreas', [AreaController::class, 'index']);
Route::get('/catalogoCompleto', [AreaController::class, 'getProgramaCompleto']);

// Categorías
Route::get('/viewCategorias', [CategoriaController::class, 'index']);
Route::get('/viewCategorias/{id}', [CategoriaController::class, 'show']);

// Grados
Route::get('/viewGrados', [GradoController::class, 'index']);
Route::get('/viewGrados/{id}', [GradoController::class, 'show']);

// Inscripción de estudiante a olimpiada
Route::post('/newInscription', [InscripcionController::class, 'store']);

// Consulta de inscripción para olimpistas
Route::post('/consultar-inscripcion-olimpista', [InscripcionController::class, 'consultarInscripcion']);

// Consulta de inscripción para tutores
Route::post('/consultar-inscripcion-tutor', [InscripcionController_Tutor::class, 'consultar']);

// Relación Categoría - Grado
Route::get('/viewCategoriaGrado', [CategoriaGradoController::class, 'index']);

// Relación Categoría - Área - Olimpiada
Route::get('/viewAreaCategoria', [OlimpiadaAreaCategoriaController::class, 'index']);
Route::post('/newAreaCategoria', [OlimpiadaAreaCategoriaController::class, 'store']);
Route::get('/viewAreaCategoria/olimpiada/{id}', [OlimpiadaAreaCategoriaController::class, 'porOlimpiada']);

// Ruta para enviar correos de contacto
Route::post('/enviar-contacto', [ContactoController::class, 'enviarContacto']);