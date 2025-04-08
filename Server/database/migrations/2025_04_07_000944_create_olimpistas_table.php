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
            $table->id('id_olimpista'); // Primary Key
            $table->string('correo', 50);
            $table->string('apellido', 50);
            $table->string('nombre', 50);
            $table->string('carnetIdentidad', 15);
            $table->string('curso', 30);
            $table->date('fechaNacimiento');
            $table->string('colegio', 50);
            $table->string('departamento', 12);
            $table->string('provincia', 50);
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
