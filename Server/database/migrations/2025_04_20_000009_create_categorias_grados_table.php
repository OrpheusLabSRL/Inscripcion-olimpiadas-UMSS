<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('categorias_grados', function (Blueprint $table) {
            $table->id('idCategoriaGrado');
            $table->unsignedBigInteger('categoria_id');
            $table->unsignedBigInteger('grado_id');
            $table->boolean('estadoCategoriaGrado')->default(true);
            $table->timestamps();

            $table->foreign('categoria_id')->references('idCategoria')->on('categorias')->onDelete('cascade');
            $table->foreign('grado_id')->references('idGrado')->on('grados')->onDelete('cascade');
            $table->unique(['categoria_id', 'grado_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('categorias_grados');
    }
};