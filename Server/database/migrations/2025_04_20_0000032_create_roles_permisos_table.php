<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('roles_permisos', function (Blueprint $table) {
            $table->id('idRolPermiso');
            $table->unsignedBigInteger('idRol');
            $table->unsignedBigInteger('idPermiso');
            $table->boolean('estadoRolPermiso')->default(true);
            $table->timestamps();

            $table->foreign('idRol')->references('idRol')->on('roles')->onDelete('cascade');
            $table->foreign('idPermiso')->references('idPermiso')->on('permisos')->onDelete('cascade');
            $table->unique(['idRol', 'idPermiso']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('roles_permisos');
    }
};