<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriaGradosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categoria_grados', function (Blueprint $table) {
            $table->id('id_CategoriaGrado'); 
            $table->unsignedBigInteger('categoria_id'); 
            $table->unsignedBigInteger('grado_id'); 
            $table->boolean('estadoCategoriaGrado')->default(true);
            $table->timestamps();

            $table->foreign('categoria_id')
                ->references('idCategoria')
                ->on('categorias')
                ->onDelete('cascade'); 

            $table->foreign('grado_id')
                ->references('idGrado')
                ->on('grados')
                ->onDelete('cascade'); 

            $table->unique(['categoria_id', 'grado_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categoria_grados');
    }
}
