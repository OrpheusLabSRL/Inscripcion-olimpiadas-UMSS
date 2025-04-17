<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInscripcionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id('id_inscripcion'); // Clave primaria
            $table->boolean('estado')->default(false);
            $table->date('fechaInicio');
            $table->date('fechaFin');
            $table->timestamps(); // created_at y updated_at

             $table->unsignedBigInteger('id_olimpista'); // FK
             $table->foreign('id_olimpista')->references('id_olimpista')->on('olimpistas')->onDelete('cascade');
             
             $table->unsignedBigInteger('id_tutor')->nullable(); // FK
             $table->foreign('id_tutor')->references('id_tutor')->on('tutores')->onDelete('cascade');

             $table->unsignedBigInteger('idOlimpAreaCategoria'); // Nueva FK
             $table->foreign('idOlimpAreaCategoria')->references('idOlimpAreaCategoria')->on('olimpiada_area_categoria')->onDelete('cascade');
              
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inscripciones');
    }
}
