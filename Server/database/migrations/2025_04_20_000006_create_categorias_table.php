<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id('idCategoria');
            $table->string('nombreCategoria', 30)->unique();
            $table->boolean('estadoCategoria')->default(true);
            $table->timestamps();
        });

        DB::table('categorias')->insert([
            ['nombreCategoria' => '3P', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '4P', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '5P', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '6P', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '1S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '2S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '3S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '4S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '5S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => '6S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Guacamayo', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Guanaco', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Londra', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Jucumari', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Bufeo', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Puma', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Primer Nivel', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Segundo Nivel', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Tercer Nivel', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Cuarto Nivel', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Quinto Nivel', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Sexto Nivel', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Builders P', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Builders S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Lego P', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombreCategoria' => 'Lego S', 'estadoCategoria' => true, 'created_at' => now(), 'updated_at' => now()]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('categorias');
    }
};