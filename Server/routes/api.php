<?php

use App\Http\Controllers\OlimpistaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\AreaController;


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
