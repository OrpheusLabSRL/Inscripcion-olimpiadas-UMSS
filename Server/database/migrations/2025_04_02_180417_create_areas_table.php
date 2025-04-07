<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateAreasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id('idArea'); 
            $table->unsignedBigInteger('idOlimpiada'); 
            $table->string('nombreArea', 30)->unique(); 
            $table->string('descripcionArea', 300)->nullable(); 
            $table->integer('costoArea')->unsigned(); 
            $table->boolean('estadoArea')->default(true); 
            $table->timestamps();

            $table->foreign('idOlimpiada')->references('idOlimpiada')->on('olimpiadas')->onDelete('cascade');
        });

        DB::statement('ALTER TABLE areas ADD CONSTRAINT chk_costo CHECK (costoArea > 0)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('areas');
    }
}
