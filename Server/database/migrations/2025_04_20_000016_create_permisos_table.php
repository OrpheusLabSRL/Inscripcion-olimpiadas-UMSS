<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('permisos', function (Blueprint $table) {
            $table->id('idPermiso');
            $table->string('nombrePermiso', 250);
            $table->boolean('estadoPermiso')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('permisos');
    }
};