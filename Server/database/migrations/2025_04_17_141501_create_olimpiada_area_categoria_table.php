<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOlimpiadaAreaCategoriaTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('olimpiada_area_categoria', function (Blueprint $table) {
            $table->id('idOlimpAreaCategoria'); // Primary key

            $table->unsignedBigInteger('idOlimpiada');
            $table->unsignedBigInteger('idArea');
            $table->unsignedBigInteger('idCategoria');

            $table->boolean('estado')->default(true); // puedes ajustar el tipo si es distinto

            // Claves foráneas
            $table->foreign('idOlimpiada')->references('idOlimpiada')->on('olimpiadas')->onDelete('cascade');
            $table->foreign('idArea')->references('idArea')->on('areas')->onDelete('cascade');
            $table->foreign('idCategoria')->references('idCategoria')->on('categorias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('olimpiada_area_categoria');
    }
}
