<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('grados', function (Blueprint $table) {
            $table->id('idGrado');
            $table->tinyInteger('numeroGrado')->unsigned();
            $table->enum('nivel', ['Primaria', 'Secundaria']);
            $table->boolean('estadoGrado')->default(true);
            $table->timestamps();
        });

        DB::table('grados')->insert([
            ['numeroGrado' => 1, 'nivel' => 'Primaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 2, 'nivel' => 'Primaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 3, 'nivel' => 'Primaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 4, 'nivel' => 'Primaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 5, 'nivel' => 'Primaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 6, 'nivel' => 'Primaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 1, 'nivel' => 'Secundaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 2, 'nivel' => 'Secundaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 3, 'nivel' => 'Secundaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 4, 'nivel' => 'Secundaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 5, 'nivel' => 'Secundaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()],
            ['numeroGrado' => 6, 'nivel' => 'Secundaria', 'estadoGrado' => true, 'created_at' => now(), 'updated_at' => now()]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('grados');
    }
};