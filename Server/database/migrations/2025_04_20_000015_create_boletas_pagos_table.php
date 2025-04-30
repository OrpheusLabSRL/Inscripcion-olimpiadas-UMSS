<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('boletas_pagos', function (Blueprint $table) {
            $table->id('codigoBoleta');
            $table->unsignedBigInteger('idTutor');
            $table->date('fechaEmision');
            $table->integer('montoTotal');
            $table->boolean('estadoBoletaPago')->default(true);
            $table->date('fechaPago')->nullable();
            $table->timestamps();

            $table->foreign('idTutor')->references('idPersona')->on('tutores')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('boletas_pagos');
    }
};