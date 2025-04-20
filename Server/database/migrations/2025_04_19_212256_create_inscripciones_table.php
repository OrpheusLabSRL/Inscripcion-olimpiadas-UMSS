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
            $table->id('idInscripcion'); // Clave primaria
            $table->boolean('estadoInscripcion')->default(false);
            $table->timestamps(); // created_at y updated_at

             $table->unsignedBigInteger('idOlimpista'); // FK
             $table->foreign('idOlimpista')->references('idPersona')->on('olimpistas')->onDelete('cascade');
             
             $table->unsignedBigInteger('idTutorResponsable'); // FK
             $table->foreign('idTutorResponsable')->references('idPersona')->on('tutores')->onDelete('cascade');
             
             $table->unsignedBigInteger('idTutorLegal'); // FK
             $table->foreign('idTutorLegal')->references('idPersona')->on('tutores')->onDelete('cascade');
            
             $table->unsignedBigInteger('idTutorArea')->nullable(); // FK
             $table->foreign('idTutorArea')->references('idPersona')->on('tutores')->onDelete('cascade');
            

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
