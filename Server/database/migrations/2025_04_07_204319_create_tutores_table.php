<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTutoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('tutores', function (Blueprint $table) {
        $table->id('id_tutor'); // clave primaria
        $table->string('nombre', 50);
        $table->string('apellido', 50);
        $table->string('tipoTutor', 15);
        $table->string('correo', 50)->unique(); // asumimos que debe ser único
        $table->string('numeroCelular', 10);
        $table->string('carnetIdentidad', 15)->unique(); // también se puede hacer único si es identificador nacional
        $table->timestamps(); // created_at y updated_at
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tutores');
    }
}
