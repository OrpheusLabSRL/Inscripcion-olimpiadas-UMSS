<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInscripcionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inscripcions', function (Blueprint $table) {
            $table->id('id_Inscripcion'); // Clave primaria
            $table->string('estadoInscripcion', 20);
            $table->date('fechaInicioInsc');
            $table->date('fechaFinInsc');
            $table->timestamps(); // created_at y updated_at

            $table->unsignedBigInteger('idOlimpista'); // FK
             $table->foreign('idOlimpista')->references('idOlimpista')->on('olimpistas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inscripcions');
    }
}
