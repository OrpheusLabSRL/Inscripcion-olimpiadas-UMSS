<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id('idArea');
            $table->unsignedBigInteger('idOlimpiada');
            $table->string('nombreArea', 50)->unique(); // Cambiado de 30 a 50 caracteres
            $table->string('descripcionArea', 300)->nullable();
            $table->integer('costoArea')->unsigned();
            $table->boolean('estadoArea')->default(true);
            $table->timestamps();

            $table->foreign('idOlimpiada')->references('idOlimpiada')->on('olimpiadas')->onDelete('cascade');
        });

        DB::statement('ALTER TABLE areas ADD CONSTRAINT chk_costo CHECK (costoArea > 0)');
        
        DB::table('areas')->insert([
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'ASTRONOMÍA Y ASTROFÍSICA',
                'descripcionArea' => 'Estudio de los astros y fenómenos cósmicos',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'BIOLOGÍA',
                'descripcionArea' => 'Estudio de los seres vivos',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'FÍSICA',
                'descripcionArea' => 'Estudio de la materia, energía y sus interacciones',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'INFORMÁTICA',
                'descripcionArea' => 'Estudio de procesamiento de información con computadoras',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'MATEMÁTICAS',
                'descripcionArea' => 'Estudio de números, estructuras y patrones',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'QUÍMICA',
                'descripcionArea' => 'Estudio de la composición, estructura y propiedades de la materia',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'idOlimpiada' => 1,
                'nombreArea' => 'ROBÓTICA',
                'descripcionArea' => 'Estudio y desarrollo de robots y sistemas automatizados',
                'costoArea' => 15,
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('areas');
    }
};