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
            $table->string('tipoTutor', 15);
            $table->string('correo', 50)->unique();
            $table->string('numeroCelular', 15);
            $table->string('carnetIdentidad', 15)->unique();
            $table->timestamps();
            
            // Índices adicionales para mejorar búsquedas
            $table->index('carnetIdentidad');
            $table->index('correo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tutores');
    }
}