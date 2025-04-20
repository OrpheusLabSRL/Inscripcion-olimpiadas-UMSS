<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('olimpiadas_areas_categorias', function (Blueprint $table) {
            $table->id('idOlimpAreaCategoria');
            $table->unsignedBigInteger('idOlimpiada');
            $table->unsignedBigInteger('idArea');
            $table->unsignedBigInteger('idCategoria');
            $table->boolean('estado')->default(true);
            $table->timestamps();

            $table->foreign('idOlimpiada')->references('idOlimpiada')->on('olimpiadas')->onDelete('cascade');
            $table->foreign('idArea')->references('idArea')->on('areas')->onDelete('cascade');
            $table->foreign('idCategoria')->references('idCategoria')->on('categorias')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('olimpiadas_areas_categorias');
    }
};