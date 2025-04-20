<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriasTable extends Migration
{
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id('idCategoria');
            $table->string('nombreCategoria', 30)->unique();
            $table->boolean('estadoCategoria')->default(true);
            $table->timestamps(); // Puedes quitar esto si no lo vas a usar
        });
    }

    public function down()
    {
        Schema::dropIfExists('categorias');
    }
}
