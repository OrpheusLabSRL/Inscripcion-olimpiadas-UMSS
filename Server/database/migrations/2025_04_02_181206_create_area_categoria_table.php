<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAreaCategoriaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('area_categoria', function (Blueprint $table) {
            $table->id('id_AreaCategoria');
            $table->unsignedBigInteger('area_id'); 
            $table->unsignedBigInteger('categoria_id'); 
            $table->boolean('estadoAreaCategoria')->default(true);

            // eliminación en cascada
            $table->foreign('area_id')->references('idArea')->on('areas')->onDelete('cascade');
            $table->foreign('categoria_id')->references('idCategoria')->on('categorias')->onDelete('cascade');
            $table->unique(['area_id', 'categoria_id']);

            $table->timestamps(); 
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('area_categoria');
    }
}
