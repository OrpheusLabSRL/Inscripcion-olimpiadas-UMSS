<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\OlimpistaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OlimpiadaController;
use App\Http\Controllers\TutorController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/hola', [OlimpiadaController::class, 'mostrarOlimpiada']);
Route::post('/register', [OlimpistaController::class, 'store']);
Route::get('/tutor/{id_tutor}/estudiantes', [TutorController::class, 'getEstudiantes']);
Route::get('/catalogoCompleto', [AreaController::class, 'getProgramaCompleto']);