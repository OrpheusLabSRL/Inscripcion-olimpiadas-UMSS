<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTipoTutorEnumInTutoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // // Eliminar la restricción UNIQUE de 'correo'
        // Schema::table('tutores', function (Blueprint $table) {
        //     $table->dropUnique(['correo']); // Usa el nombre del índice si Laravel no puede inferirlo
        // });
        Schema::table('tutores', function (Blueprint $table) {
            $table->dropUnique(['carnetIdentidad']); // Usa el nombre del índice si Laravel no puede inferirlo
        });

        // Cambiar el ENUM para agregar 'Estudiante'
        DB::statement("ALTER TABLE tutores MODIFY tipoTutor ENUM('Profesor', 'Padre/Madre', 'Tutor Legal', 'Estudiante')");
    }

    public function down()
    {
        // Revertir el cambio de ENUM
        DB::statement("ALTER TABLE tutores MODIFY tipoTutor ENUM('Profesor', 'Padre/Madre', 'Tutor Legal')");

        // Volver a agregar UNIQUE a 'correo'
        Schema::table('tutores', function (Blueprint $table) {
            $table->unique('correo');
        });
    }
}
