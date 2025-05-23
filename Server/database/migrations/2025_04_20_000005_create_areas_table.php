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
            $table->string('nombreArea', 50)->unique(); // nombre extendido a 50 caracteres
            $table->string('descripcionArea', 300)->nullable(); // descripción opcional
            $table->boolean('estadoArea')->default(true); // nuevo campo estadoArea con valor por defecto true
            $table->timestamps();
        });

        DB::table('areas')->insert([
            [
                'nombreArea' => 'ASTRONOMÍA Y ASTROFÍSICA',
                'descripcionArea' => 'Estudio de los astros y fenómenos cósmicos',
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombreArea' => 'BIOLOGÍA',
                'descripcionArea' => 'Estudio de los seres vivos',
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombreArea' => 'FÍSICA',
                'descripcionArea' => 'Estudio de la materia, energía y sus interacciones',
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombreArea' => 'INFORMÁTICA',
                'descripcionArea' => 'Estudio de procesamiento de información con computadoras',
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombreArea' => 'MATEMÁTICAS',
                'descripcionArea' => 'Estudio de números, estructuras y patrones',
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombreArea' => 'QUÍMICA',
                'descripcionArea' => 'Estudio de la composición, estructura y propiedades de la materia',
                'estadoArea' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombreArea' => 'ROBÓTICA',
                'descripcionArea' => 'Estudio y desarrollo de robots y sistemas automatizados',
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
