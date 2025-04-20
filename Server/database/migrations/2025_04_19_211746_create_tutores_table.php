<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tutores', function (Blueprint $table) {
            // Eliminamos idTutor y usamos idPersona como PK
            $table->unsignedBigInteger('idPersona')->primary();
            
            $table->string('tipoTutor', 20); // Ej: Padre, Madre, Tutor Legal
            $table->string('telefono', 8);
            
            // Convertimos la relación a PK
            $table->foreign('idPersona')
                  ->references('idPersona')
                  ->on('personas')
                  ->onDelete('cascade'); // Elimina el tutor si se elimina la persona
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tutores');
    }
};