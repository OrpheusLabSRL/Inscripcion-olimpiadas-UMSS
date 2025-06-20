<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonaController;
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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\BoletaPagoController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RolPermisoController;


// Ruta protegida para obtener el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Persona
Route::post('/persona/data', [PersonaController::class, 'getPersonData']);

// Olimpistas
Route::post('/register', [OlimpistaController::class, 'store']);
Route::get('/olimpista/{id}/areas', [InscripcionController::class, 'getAreaByOlimpista']);
Route::get('/olimpista/{carnet_identidad}/areasByCi', [OlimpistaController::class, 'getAreaOlimpistaByCi']);
Route::get('/olimpistas', [OlimpistaController::class, 'getAllOlimpistas']);
Route::get('/olimpista/{carnet_identidad}/habilitado/{idOlimpiada}', [InscripcionController::class, 'enableForIncription']);
Route::get('/olimpista/{id}/tutores', [TutorController::class, 'getTutoresByOlimpista']);
Route::get('/tutores/all', [TutorController::class, 'getAllTutors']);
Route::get('/olympiad-registrations-report', [OlimpistaController::class, 'getOlympiadRegistrationsReport']);


// Tutores
Route::post('/tutores', [TutorController::class, 'store']);
Route::get('/tutor/{id_tutor}/estudiantes', [OlimpistaController::class, 'getOlimpistasByTutor']);
Route::get('/tutores/verificar', [TutorController::class, 'checkExistingTutor']);
Route::get('/tutor/{id}', [TutorController::class, 'getTutorWithPersona']);
Route::put('/tutor/{id}/{codigoInscripcion}/inscripciones/update', [InscripcionController::class, 'finishRegister']);

// Contacto
Route::post('/contacto', [InformacionContactoController::class, 'store']);
Route::post('/enviar-contacto', [ContactoController::class, 'enviarContacto']);

// Olimpiadas
Route::get('/viewOlimpiadas', [OlimpiadaController::class, 'mostrarOlimpiada']);
Route::get('/viewOlimpiadasWithAreasCategorias', [OlimpiadaController::class, 'mostrarOlimpiadasWithAreasCategorias']);
Route::post('/registrarOlimpiadas', [OlimpiadaController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::delete('/deleteOlimpiada/{id}', [OlimpiadaController::class, 'destroy']);
Route::put('/editarOlimpiadas/{id}/estado', [OlimpiadaController::class, 'cambiarEstado']);
Route::put('/editarOlimpiadas/{id}', [OlimpiadaController::class, 'update']);

//Roles y Permisos
Route::get('/roles', [RolController::class, 'index']);
Route::post('/roles', [RolController::class, 'store']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::get('/permisos', [PermisoController::class, 'index']);
Route::get('/viewUsuarios', [UsuarioController::class, 'index']);
Route::get('/getRolesPermisos', [RolPermisoController::class, 'index']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);

// Áreas
Route::get('/viewAreas', [AreaController::class, 'index']);
Route::post('/registrarAreas', [AreaController::class, 'store']);
Route::get('/catalogoCompleto/{id}', [AreaController::class, 'getProgramaCompleto']);
Route::put('/areas/{id}', [AreaController::class, 'update']);
Route::patch('/areas/{id}/estado', [AreaController::class, 'actualizarEstado']);
Route::delete('/areas/{id}', [AreaController::class, 'destroy']);

// Categorías
Route::get('/viewCategorias', [CategoriaController::class, 'index']);
Route::get('/viewCategorias/{id}', [CategoriaController::class, 'show']);
Route::post('/categorias/with-grados', [CategoriaController::class, 'storeWithGrados']);

// Grados
Route::get('/viewGrados', [GradoController::class, 'index']);
Route::get('/viewGrados/{id}', [GradoController::class, 'show']);

// Inscripción
Route::post('/newInscription', [InscripcionController::class, 'store']);
Route::get('/obtenerInscripciones/olimpiadas', [InscripcionController::class, 'getInscripcionesConOlimpiadas']);
Route::post('/consultar-inscripcion-olimpista', [InscripcionController::class, 'consultarInscripcion']);
Route::post('/consultar-inscripcion-tutor', [InscripcionController_Tutor::class, 'consultar']); 
Route::post('/verificar-uso-areas', [InscripcionController::class, 'verificarUsoAreasMasivo']);
Route::post('/verificar-uso-categorias', [InscripcionController::class, 'verificarUsoCategoriasMasivo']);

// Categoría - Grado
Route::get('/viewCategoriaGrado', [CategoriaGradoController::class, 'index']);
Route::patch('/changeEstadoCategoriaGrado/{id}', [CategoriaGradoController::class, 'cambiarEstado']);
Route::put('/updateCategoriaWithGrados/{idCategoria}', [CategoriaGradoController::class, 'actualizarCategoriaYGrados']);
Route::delete('/deleteCategoriaGrado/{id}', [CategoriaGradoController::class, 'destroy']);
Route::post('/categorias/with-grados', [CategoriaGradoController::class, 'storeWithGrados']);

// Categoría - Área - Olimpiada
Route::get('/viewAreaCategoria', [OlimpiadaAreaCategoriaController::class, 'index']);
Route::post('/newAreaCategoria', [OlimpiadaAreaCategoriaController::class, 'store']);
Route::get('/viewAreaCategoria/olimpiada/{id}', [OlimpiadaAreaCategoriaController::class, 'porOlimpiada']);
Route::delete('/eliminarOlimpiadas/{idOlimpiada}/area/{idArea}', [OlimpiadaAreaCategoriaController::class, 'eliminarPorOlimpiadaYArea']);

 

Route::get('/boletas/generar/{idTutor}/{codigoInscripcion}', [BoletaPagoController::class, 'generarBoleta']);
Route::get('/boletas/reimprimir/{codigoBoleta}', [BoletaPagoController::class, 'reimprimirBoleta']);


Route::post('/boletaPago/check', [BoletaPagoController::class, 'generarPago']);
Route::post('/boletaPago/confirmarPago', [BoletaPagoController::class, 'confirmarPago']);

Route::get('/boletaPago/boletasByTutor/{tutorId}', [BoletaPagoController::class, 'getBoletasPorTutor']);

// Excel
Route::post('/register-from-excel', [ExcelController::class, 'registerFromExcel']);
Route::post('/validate-excel-data', [ExcelController::class, 'validateExcelData']);
Route::get('/available-combinations', [ExcelController::class, 'getAvailableCombinations']);


//Usuarios
Route::prefix('usuarios')->group(function () {
    Route::get('/', [UsuarioController::class, 'index']); // Obtener todos
    Route::get('/roles', [UsuarioController::class, 'getRoles']); // Obtener roles
    Route::put('/{id}/estado', [UsuarioController::class, 'actualizarEstado']); // Cambiar estado
    Route::put('/{id}', [UsuarioController::class, 'update']); // Actualizar usuario
    Route::delete('/{id}', [UsuarioController::class, 'destroy']); // Eliminar usuario
});
