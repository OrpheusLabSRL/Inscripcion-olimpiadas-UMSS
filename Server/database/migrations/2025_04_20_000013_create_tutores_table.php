<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tutores', function (Blueprint $table) {
            $table->unsignedBigInteger('idPersona')->primary();
            $table->string('tipoTutor', 20)->nullable();
            $table->string('telefono', 8);
            $table->timestamps();

            $table->foreign('idPersona')->references('idPersona')->on('personas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tutores');
    }
};