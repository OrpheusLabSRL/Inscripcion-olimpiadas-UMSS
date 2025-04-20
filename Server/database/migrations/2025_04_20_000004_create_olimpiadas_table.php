<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('olimpiadas', function (Blueprint $table) {
            $table->id('idOlimpiada');
            $table->unsignedBigInteger('idUsuario');
            $table->string('nombreOlimpiada', 30)->unique();
            $table->integer('version')->unsigned();
            $table->boolean('estadoOlimpiada')->default(true);
            $table->date('fechaInicioOlimpiada');
            $table->date('fechaFinOlimpiada');
            $table->timestamps();

            $table->foreign('idUsuario')->references('idUsuario')->on('usuarios')->onDelete('cascade');
            $table->unique(['nombreOlimpiada', 'version']);
        });

        DB::statement('ALTER TABLE olimpiadas ADD CONSTRAINT chk_fecha CHECK (fechaFinOlimpiada > fechaInicioOlimpiada)');
    }

    public function down()
    {
        Schema::dropIfExists('olimpiadas');
    }
};