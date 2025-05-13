<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('olimpiadas_areas_categorias', function (Blueprint $table) {
            $table->id('idOlimpAreaCategoria');
            $table->unsignedBigInteger('idOlimpiada');
            $table->unsignedBigInteger('idArea');
            $table->unsignedBigInteger('idCategoria');
            $table->decimal('costo', 8, 2)->default(0); // ✅ nuevo campo
            $table->boolean('estado')->default(true);
            $table->timestamps();

            $table->foreign('idOlimpiada')->references('idOlimpiada')->on('olimpiadas')->onDelete('cascade');
            $table->foreign('idArea')->references('idArea')->on('areas')->onDelete('cascade');
            $table->foreign('idCategoria')->references('idCategoria')->on('categorias')->onDelete('cascade');
        });

        $olimpiada = DB::table('olimpiadas')->where('nombreOlimpiada', 'Olimpiada Científica Estudiantil')->first();
        if (!$olimpiada) {
            throw new Exception("No se encontró la olimpiada requerida.");
        }

        $olimpiadaId = $olimpiada->idOlimpiada;
        $areas = DB::table('areas')->pluck('idArea', 'nombreArea');
        $categorias = DB::table('categorias')->pluck('idCategoria', 'nombreCategoria');

        $defaultCosto = 15.00;
        $now = now();

        // Mapa de combinaciones: 'Nombre Área' => ['Categorías']
        $combinaciones = [
            'ASTRONOMÍA Y ASTROFÍSICA' => ['3P','4P','5P','6P','1S','2S','3S','4S','5S','6S'],
            'BIOLOGÍA' => ['2S','3S','4S','5S','6S'],
            'FÍSICA' => ['4S','5S','6S'],
            'INFORMÁTICA' => ['Guacamayo','Guanaco','Londra','Jucumari','Bufeo','Puma'],
            'MATEMÁTICAS' => ['Primer Nivel','Segundo Nivel','Tercer Nivel','Cuarto Nivel','Quinto Nivel','Sexto Nivel'],
            'QUÍMICA' => ['2S','3S','4S','5S','6S'],
            'ROBÓTICA' => ['Builders P','Builders S','Lego P','Lego S'],
        ];

        $insertData = [];

        foreach ($combinaciones as $nombreArea => $cats) {
            $idArea = $areas[$nombreArea] ?? null;
            if (!$idArea) continue;

            foreach ($cats as $cat) {
                $idCategoria = $categorias[$cat] ?? null;
                if (!$idCategoria) continue;

                $insertData[] = [
                    'idOlimpiada' => $olimpiadaId,
                    'idArea' => $idArea,
                    'idCategoria' => $idCategoria,
                    'costo' => $defaultCosto,
                    'estado' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('olimpiadas_areas_categorias')->insert($insertData);
    }

    public function down()
    {
        Schema::dropIfExists('olimpiadas_areas_categorias');
    }
};
