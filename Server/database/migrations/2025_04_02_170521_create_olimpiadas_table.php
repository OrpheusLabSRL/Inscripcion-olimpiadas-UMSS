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
            $table->string('nombreOlimpiada', 30)->unique(); 
            $table->integer('version')->unsigned(); 
            $table->boolean('estadoOlimpiada')->default(true); 
            $table->date('fechaInicioOlimp'); 
            $table->date('fechaFinOlimp'); 
            $table->timestamps();

            $table->unique(['nombreOlimpiada', 'version']);
        });
        DB::statement('ALTER TABLE olimpiadas ADD CONSTRAINT chk_fecha CHECK (fechaFinOlimp > fechaInicioOlimp)');
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
