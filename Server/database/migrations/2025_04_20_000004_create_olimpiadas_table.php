<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('olimpiadas', function (Blueprint $table) {
            $table->id('idOlimpiada');
            $table->unsignedBigInteger('idUsuario');
            $table->string('nombreOlimpiada', 50)->unique();// Cambiado de 30 a 50 caracteres
            $table->integer('version')->unsigned();
            $table->boolean('estadoOlimpiada')->default(true);
            $table->date('fechaInicioOlimpiada');
            $table->date('fechaFinOlimpiada');
            $table->timestamps();

            $table->foreign('idUsuario')->references('idUsuario')->on('usuarios')->onDelete('cascade');
            $table->unique(['nombreOlimpiada', 'version']);
        });

        DB::statement('ALTER TABLE olimpiadas ADD CONSTRAINT chk_fecha CHECK (fechaFinOlimpiada > fechaInicioOlimpiada)');
        
        $adminId = DB::table('usuarios')->where('nombreUsuario', 'admin')->value('idUsuario');
        DB::table('olimpiadas')->insert([
            'idUsuario' => 1,
            'nombreOlimpiada' => 'Olimpiada Científica Estudiantil',
            'version' => 1,
            'estadoOlimpiada' => true,
            'fechaInicioOlimpiada' => '2025-05-01',
            'fechaFinOlimpiada' => '2025-10-31',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('olimpiadas');
    }
};