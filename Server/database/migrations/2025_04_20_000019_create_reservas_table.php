<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id('idReserva');
            $table->unsignedBigInteger('idCategoria');
            $table->unsignedBigInteger('idAula');
            $table->date('fechaReserva');
            $table->time('horaInicio');
            $table->time('horaFin');
            $table->boolean('estadoReserva')->default(true);
            $table->timestamps();

            $table->foreign('idCategoria')->references('idCategoria')->on('categorias')->onDelete('cascade');
            $table->foreign('idAula')->references('idAula')->on('aulas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reservas');
    }
};