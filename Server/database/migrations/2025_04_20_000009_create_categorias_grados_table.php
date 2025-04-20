<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('categorias_grados', function (Blueprint $table) {
            $table->id('idCategoriaGrado');
            $table->unsignedBigInteger('categoria_id');
            $table->unsignedBigInteger('grado_id');
            $table->boolean('estadoCategoriaGrado')->default(true);
            $table->timestamps();

            $table->foreign('categoria_id')->references('idCategoria')->on('categorias')->onDelete('cascade');
            $table->foreign('grado_id')->references('idGrado')->on('grados')->onDelete('cascade');
            $table->unique(['categoria_id', 'grado_id']);
        });

        // Obtener IDs necesarios
        $categorias = DB::table('categorias')->pluck('idCategoria', 'nombreCategoria');
        $grados = DB::table('grados')->get()->groupBy(['nivel', 'numeroGrado']);

        // Insertar relaciones
        DB::table('categorias_grados')->insert([
            // Categorías estándar (un solo grado)
            ['categoria_id' => $categorias['3P'], 'grado_id' => $grados['Primaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['4P'], 'grado_id' => $grados['Primaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['5P'], 'grado_id' => $grados['Primaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['6P'], 'grado_id' => $grados['Primaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['1S'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['2S'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['3S'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['4S'], 'grado_id' => $grados['Secundaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['5S'], 'grado_id' => $grados['Secundaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['6S'], 'grado_id' => $grados['Secundaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática - Guacamayo (5to y 6to Primaria)
            ['categoria_id' => $categorias['Guacamayo'], 'grado_id' => $grados['Primaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Guacamayo'], 'grado_id' => $grados['Primaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática - Guanaco (1ro a 3ro Secundaria)
            ['categoria_id' => $categorias['Guanaco'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Guanaco'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Guanaco'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática - Londra (1ro a 3ro Secundaria)
            ['categoria_id' => $categorias['Londra'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Londra'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Londra'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática - Jucumari (4to a 6to Secundaria)
            ['categoria_id' => $categorias['Jucumari'], 'grado_id' => $grados['Secundaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Jucumari'], 'grado_id' => $grados['Secundaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Jucumari'], 'grado_id' => $grados['Secundaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática - Bufeo (1ro a 3ro Secundaria)
            ['categoria_id' => $categorias['Bufeo'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Bufeo'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Bufeo'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Informática - Puma (4to a 6to Secundaria)
            ['categoria_id' => $categorias['Puma'], 'grado_id' => $grados['Secundaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Puma'], 'grado_id' => $grados['Secundaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Puma'], 'grado_id' => $grados['Secundaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Matemáticas - Niveles (1ro a 6to Secundaria)
            ['categoria_id' => $categorias['Primer Nivel'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Segundo Nivel'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Tercer Nivel'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Cuarto Nivel'], 'grado_id' => $grados['Secundaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Quinto Nivel'], 'grado_id' => $grados['Secundaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Sexto Nivel'], 'grado_id' => $grados['Secundaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Robótica - Builders P (5to y 6to Primaria)
            ['categoria_id' => $categorias['Builders P'], 'grado_id' => $grados['Primaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Builders P'], 'grado_id' => $grados['Primaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Robótica - Builders S (1ro a 6to Secundaria)
            ['categoria_id' => $categorias['Builders S'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Builders S'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Builders S'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Builders S'], 'grado_id' => $grados['Secundaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Builders S'], 'grado_id' => $grados['Secundaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Builders S'], 'grado_id' => $grados['Secundaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Robótica - Lego P (5to y 6to Primaria)
            ['categoria_id' => $categorias['Lego P'], 'grado_id' => $grados['Primaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Lego P'], 'grado_id' => $grados['Primaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Robótica - Lego S (1ro a 6to Secundaria)
            ['categoria_id' => $categorias['Lego S'], 'grado_id' => $grados['Secundaria'][1]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Lego S'], 'grado_id' => $grados['Secundaria'][2]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Lego S'], 'grado_id' => $grados['Secundaria'][3]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Lego S'], 'grado_id' => $grados['Secundaria'][4]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Lego S'], 'grado_id' => $grados['Secundaria'][5]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['categoria_id' => $categorias['Lego S'], 'grado_id' => $grados['Secundaria'][6]->first()->idGrado, 'estadoCategoriaGrado' => true, 'created_at' => now(), 'updated_at' => now()]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('categorias_grados');
    }
};