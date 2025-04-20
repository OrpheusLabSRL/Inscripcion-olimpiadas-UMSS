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
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
};