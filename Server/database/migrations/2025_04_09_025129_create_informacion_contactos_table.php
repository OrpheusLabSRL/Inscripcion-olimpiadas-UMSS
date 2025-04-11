<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInformacionContactosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('informacion_contactos', function (Blueprint $table) {
            $table->id('id_contacto');

            $table->string('correo_contacto', 50);
            $table->string('pertenece_correo', 20);
            $table->integer('numero_contacto');
            $table->string('pertenece_numero', 20);

            $table->unsignedBigInteger('id_olimpista')->unique(); // Uno a uno
            $table->foreign('id_olimpista')->references('id_olimpista')->on('olimpistas')->onDelete('cascade');

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
        Schema::dropIfExists('informacion_contactos');
    }
}
