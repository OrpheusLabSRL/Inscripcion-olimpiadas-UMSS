<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('idUsuario');
            $table->unsignedBigInteger('idRol')->nullable();
            $table->string('nombreUsuario', 20)->nullable();
            $table->string('nombre', 20)->nullable();
            $table->string('email', 30)->nullable();
            $table->string('password', 13)->nullable();
            $table->boolean('estadoUsuario')->nullable();
            $table->timestamps();

            $table->foreign('idRol')
                ->references('idRol')
                ->on('roles')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
}
