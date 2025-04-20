<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('olimpistas', function (Blueprint $table) {
            $table->unsignedBigInteger('idPersona')->primary();
            
            $table->date('fechaNacimiento');
            $table->string('departamento', 15);
            $table->string('provincia', 50);
            $table->string('curso', 30);
            $table->string('colegio', 50);
            
            // Convertimos la relación a PK
            $table->foreign('idPersona')
                  ->references('idPersona')
                  ->on('personas')
                  ->onDelete('cascade'); // Añadido cascade para mantener integridad
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('olimpistas');
    }
};