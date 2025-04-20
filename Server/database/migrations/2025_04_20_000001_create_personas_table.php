<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->id('idPersona');
            $table->string('nombre', 50);
            $table->string('apellido', 50);
            $table->string('carnetIdentidad', 12)->unique();
            $table->string('correoElectronico', 100);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('personas');
    }
};