<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('olimpistas', function (Blueprint $table) {
            $table->unsignedBigInteger('idPersona')->primary();
            $table->date('fechaNacimiento');
            $table->string('departamento', 15);
            $table->string('municipio', 50);
            $table->string('curso', 30);
            $table->string('colegio', 50);
            $table->timestamps();

            $table->foreign('idPersona')->references('idPersona')->on('personas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('olimpistas');
    }
};