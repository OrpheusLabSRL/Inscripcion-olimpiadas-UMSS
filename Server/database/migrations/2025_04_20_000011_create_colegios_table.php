<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('colegios', function (Blueprint $table) {
            $table->id('idColegio');
            $table->string('nombreColegio', 150);
            $table->string('departamento', 100);
            $table->string('municipio', 100);
            $table->string('distrito', 100);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('colegios');
    }
};