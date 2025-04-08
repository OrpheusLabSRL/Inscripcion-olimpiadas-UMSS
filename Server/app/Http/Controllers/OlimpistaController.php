<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Olimpista;
use Illuminate\Support\Facades\Log;

class OlimpistaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    Log::info('Datos del Request:', $request->all());
    
    // Validar los datos
    // $request->validate([
    //     'correoComp' => 'required|email|max:30',
    //     'apellidosComp' => 'required|string|max:30',
    //     'NombresComp' => 'required|string|max:30',
    //     'carnetComp' => 'required|string|max:15',
    //     'fechaNacimiento' => 'required|date',
    //     'colegio' => 'required|string|max:50',
    //     'departamento' => 'required|string|max:12',
    //     'provincia' => 'required|string|max:30',
    // ]);

    // Crear el nuevo Olimpista
    $olimpista = Olimpista::create([
        'correo' => $request->Email,
        'apellido' => $request->Apellido,
        'Nombre' => $request->Nombre,
        'carnetIdentidad' => $request->CarnetIdentidad,
        'curso' => $request->Curso,
        'fechaNacimiento' => $request->FechaNacimiento,
        'colegio' => $request->Colegio,
        'departamento' => $request->Departamento,
        'provincia' => $request->Provincia,
    ]);
    
    $olimpista->tutores()->attach($request->id_tutor);

    // Retornar respuesta (puede ser JSON o redirección)
    return response()->json([
        'message' => 'Olimpista creado exitosamente',
        'data' => $olimpista
    ], 201);
}


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
