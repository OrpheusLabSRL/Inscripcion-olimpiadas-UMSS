<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateOlimpiadasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('olimpiadas', function (Blueprint $table) {
            $table->id('idOlimpiada');
            $table->unsignedBigInteger('idUsuario');
            $table->string('nombreOlimpiada', 30);
            $table->integer('version')->unsigned();
            $table->boolean('estadoOlimpiada')->default(true);
            $table->date('fechaInicioOlimpiada');
            $table->date('fechaFinOlimpiada');
            $table->timestamps();

            $table->unique(['nombreOlimpiada', 'version']);
            $table->foreign('idUsuario')->references('idUsuario')->on('usuarios')->onDelete('restrict')->onUpdate('restrict');
        });

        DB::statement('ALTER TABLE olimpiadas ADD CONSTRAINT chk_fecha CHECK (fechaFinOlimpiada > fechaInicioOlimpiada)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('olimpiadas');
    }
}
