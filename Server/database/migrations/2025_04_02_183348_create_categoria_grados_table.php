<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriaGradosTable extends Migration
{
    public function up()
    {
        Schema::create('categoria_grado', function (Blueprint $table) {
            $table->id('idCategoriaGrado'); 
            $table->unsignedBigInteger('idGrado')->nullable(); 
            $table->unsignedBigInteger('idCategoria')->nullable(); 
            $table->boolean('estadoCategoriaGrado')->nullable(); 
            $table->timestamps();

            $table->foreign('idGrado')
                ->references('idGrado')
                ->on('grados')
                ->onDelete('cascade');

            $table->foreign('idCategoria')
                ->references('idCategoria')
                ->on('categorias')
                ->onDelete('cascade');
 
            $table->unique(['idCategoria', 'idGrado']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('categoria_grado');
    }
}
