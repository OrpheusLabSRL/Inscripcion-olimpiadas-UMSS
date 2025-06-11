<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:50',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|string|min:6',
        'idRol' => 'required|exists:roles,idRol'
    ]);

    $usuario = Usuario::create([
        'nombre' => $request->nombre,
        'nombreUsuario' => $request->nombre,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'idRol' => $request->idRol,
        'estadoUsuario' => true
    ]);

    return response()->json([
        'message' => 'Usuario creado exitosamente',
        'usuario' => $usuario
    ], 201);
}

    public function index()
        {
            $usuarios = Usuario::with(['rol.permisos'])->get();
            return response()->json($usuarios);
        }
        public function actualizarEstado(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->estadoUsuario = $request->input('estadoUsuario');
        $usuario->save();

        return response()->json([
            'success' => true,
            'data' => $usuario->load('rol.permisos')
        ]);
    }

    // Actualizar información de usuario
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'idRol' => 'sometimes|exists:roles,idRol',
            'nombreUsuario' => 'sometimes|string|max:50|unique:usuarios,nombreUsuario,'.$usuario->idUsuario.',idUsuario',
            'nombre' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:usuarios,email,'.$usuario->idUsuario.',idUsuario',
            'password' => 'sometimes|string|min:8',
            'estadoUsuario' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['idRol', 'nombreUsuario', 'nombre', 'email', 'estadoUsuario']);
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);

        return response()->json([
            'success' => true,
            'data' => $usuario->load('rol.permisos')
        ]);
    }

    // Eliminar usuario
    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

    // Obtener roles disponibles
    public function getRoles()
    {
        $roles = Rol::with('permisos')->where('estadoRol', true)->get();
        return response()->json($roles);
    }
}
