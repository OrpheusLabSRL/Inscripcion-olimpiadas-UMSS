<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('aulas', function (Blueprint $table) {
            $table->id('idAula');
            $table->string('nombreAula', 20);
            $table->integer('capacidad');
            $table->string('ubicacion', 100);
            $table->boolean('estadoaula')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('aulas');
    }
};