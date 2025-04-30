<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id('idInscripcion');
            $table->boolean('estadoInscripcion')->default(false);
            $table->timestamps();

            $table->unsignedBigInteger('idOlimpista');
            $table->unsignedBigInteger('idTutorResponsable');
            $table->unsignedBigInteger('idTutorLegal');
            $table->unsignedBigInteger('idTutorArea')->nullable();
            $table->unsignedBigInteger('idOlimpAreaCategoria');

            $table->foreign('idOlimpista')->references('idPersona')->on('olimpistas')->onDelete('cascade');
            $table->foreign('idTutorResponsable')->references('idPersona')->on('tutores')->onDelete('cascade');
            $table->foreign('idTutorLegal')->references('idPersona')->on('tutores')->onDelete('cascade');
            $table->foreign('idTutorArea')->references('idPersona')->on('tutores')->onDelete('cascade');
            $table->foreign('idOlimpAreaCategoria')->references('idOlimpAreaCategoria')->on('olimpiadas_areas_categorias')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('inscripciones');
    }
};