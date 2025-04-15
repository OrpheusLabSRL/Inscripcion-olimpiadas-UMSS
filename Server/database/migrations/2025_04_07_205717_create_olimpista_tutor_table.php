<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOlimpistaTutorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('olimpista_tutor', function (Blueprint $table) {
            $table->unsignedBigInteger('id_tutor');
            $table->unsignedBigInteger('id_olimpista');
            $table->enum('rol', [
                'responsable inscripcion',
                'tutor area1',
                'tutor area2',
                'tutor legal'
            ]);

            $table->boolean('estado')->default(true); 

            // Claves foráneas
            $table->foreign('id_tutor')->references('id_tutor')->on('tutores')->onDelete('cascade');
            $table->foreign('id_olimpista')->references('id_olimpista')->on('olimpistas')->onDelete('cascade');

            // Clave primaria compuesta (incluye ahora el campo 'rol')
            $table->primary(['id_tutor', 'id_olimpista', 'rol']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('olimpista_tutor');
    }
}
