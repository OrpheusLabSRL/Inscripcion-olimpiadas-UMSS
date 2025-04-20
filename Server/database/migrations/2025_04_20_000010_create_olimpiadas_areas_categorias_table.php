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
            $table->boolean('estado')->default(true);
            $table->timestamps();

            $table->foreign('idOlimpiada')->references('idOlimpiada')->on('olimpiadas')->onDelete('cascade');
            $table->foreign('idArea')->references('idArea')->on('areas')->onDelete('cascade');
            $table->foreign('idCategoria')->references('idCategoria')->on('categorias')->onDelete('cascade');
        });

        // Obtener IDs necesarios
        $olimpiadaId = DB::table('olimpiadas')->where('nombreOlimpiada', 'Olimpiada Científica Estudiantil')->first()->idOlimpiada;
        
        $areas = DB::table('areas')->pluck('idArea', 'nombreArea');
        $categorias = DB::table('categorias')->pluck('idCategoria', 'nombreCategoria');

        // Insertar relaciones
        DB::table('olimpiadas_areas_categorias')->insert([
            // Astronomía - Astrofísica
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['3P'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['4P'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['5P'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['6P'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['1S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['2S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['3S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['4S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['5S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ASTRONOMÍA Y ASTROFÍSICA'], 'idCategoria' => $categorias['6S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Biología
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['BIOLOGÍA'], 'idCategoria' => $categorias['2S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['BIOLOGÍA'], 'idCategoria' => $categorias['3S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['BIOLOGÍA'], 'idCategoria' => $categorias['4S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['BIOLOGÍA'], 'idCategoria' => $categorias['5S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['BIOLOGÍA'], 'idCategoria' => $categorias['6S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Física
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['FÍSICA'], 'idCategoria' => $categorias['4S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['FÍSICA'], 'idCategoria' => $categorias['5S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['FÍSICA'], 'idCategoria' => $categorias['6S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['INFORMÁTICA'], 'idCategoria' => $categorias['Guacamayo'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['INFORMÁTICA'], 'idCategoria' => $categorias['Guanaco'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['INFORMÁTICA'], 'idCategoria' => $categorias['Londra'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['INFORMÁTICA'], 'idCategoria' => $categorias['Jucumari'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['INFORMÁTICA'], 'idCategoria' => $categorias['Bufeo'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['INFORMÁTICA'], 'idCategoria' => $categorias['Puma'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Matemáticas
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['MATEMÁTICAS'], 'idCategoria' => $categorias['Primer Nivel'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['MATEMÁTICAS'], 'idCategoria' => $categorias['Segundo Nivel'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['MATEMÁTICAS'], 'idCategoria' => $categorias['Tercer Nivel'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['MATEMÁTICAS'], 'idCategoria' => $categorias['Cuarto Nivel'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['MATEMÁTICAS'], 'idCategoria' => $categorias['Quinto Nivel'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['MATEMÁTICAS'], 'idCategoria' => $categorias['Sexto Nivel'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Química
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['QUÍMICA'], 'idCategoria' => $categorias['2S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['QUÍMICA'], 'idCategoria' => $categorias['3S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['QUÍMICA'], 'idCategoria' => $categorias['4S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['QUÍMICA'], 'idCategoria' => $categorias['5S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['QUÍMICA'], 'idCategoria' => $categorias['6S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Robótica
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ROBÓTICA'], 'idCategoria' => $categorias['Builders P'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ROBÓTICA'], 'idCategoria' => $categorias['Builders S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ROBÓTICA'], 'idCategoria' => $categorias['Lego P'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['idOlimpiada' => $olimpiadaId, 'idArea' => $areas['ROBÓTICA'], 'idCategoria' => $categorias['Lego S'], 'estado' => true, 'created_at' => now(), 'updated_at' => now()]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('olimpiadas_areas_categorias');
    }
};