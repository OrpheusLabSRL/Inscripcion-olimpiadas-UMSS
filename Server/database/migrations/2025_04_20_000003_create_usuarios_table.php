<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('idUsuario');
            $table->unsignedBigInteger('idRol');
            $table->string('nombreUsuario', 20)->unique();
            $table->string('nombre', 20);
            $table->string('email', 30)->unique();
            $table->string('password', 60);
            $table->boolean('estadoUsuario')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('idRol')->references('idRol')->on('roles')->onDelete('cascade');
        });
        $adminRolId = DB::table('roles')->insertGetId([
            'nombreRol' => 'Administrador',
            'descripcionRol' => 'Rol con todos los permisos',
            'estadoRol' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    
        // Crear usuario administrador
        DB::table('usuarios')->insert([
            'idRol' => $adminRolId,
            'nombreUsuario' => 'admin',
            'nombre' => 'Administrador',
            'email' => 'admin@olimpiadas.com',
            'password' => bcrypt('password'), // Asegúrate de hashear la contraseña
            'estadoUsuario' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
};