<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTutoresTable extends Migration
{
    public function up()
    {
        Schema::create('tutores', function (Blueprint $table) {
            $table->id('id_tutor');
            $table->string('nombre', 50);
            $table->string('apellido', 50);
            $table->enum('tipoTutor', ['Profesor', 'Padre/Madre', 'Tutor Legal']);
            $table->string('correo', 50)->unique();
            $table->string('numeroCelular', 8);
            $table->string('carnetIdentidad', 12)->unique();
            $table->timestamps();
            
            $table->index('carnetIdentidad');
            $table->index('correo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tutores');
    }
}