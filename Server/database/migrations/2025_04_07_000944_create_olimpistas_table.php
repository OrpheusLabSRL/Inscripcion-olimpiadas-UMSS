<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOlimpistasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('olimpistas', function (Blueprint $table) {
            $table->id('idOlimpista'); // Primary Key
            $table->string('correoComp', 30);
            $table->string('apellidosComp', 30);
            $table->string('NombresComp', 30);
            $table->string('carnetComp', 15);
            $table->date('fechaNacimiento');
            $table->string('colegio', 50);
            $table->string('departamento', 12);
            $table->string('provincia', 30);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('olimpistas');
    }
}
