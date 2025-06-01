<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        // Tabla de usuarios
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('idUsuario');
            $table->unsignedBigInteger('idRol');
            $table->string('nombreUsuario', 20)->unique();
            $table->string('nombre', 20);
            $table->string('email', 30)->unique();
            $table->string('password', 60);
            $table->boolean('estadoUsuario')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('idRol')->references('idRol')->on('roles')->onDelete('cascade');
        });

        // Insertar el rol "Administrador"
        $adminRolId = DB::table('roles')->insertGetId([
            'nombreRol' => 'Administrador',
            'descripcionRol' => 'Rol con todos los permisos',
            'estadoRol' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Crear permisos necesarios
        $permisos = [
            'ver_olimpiadas',
            'crear_usuarios',
            'gestionar_areas',
            'gestionar_categorias',
            'gestionar_datos_base',
            'gestionar_olimpiadas',
            'crear_olimpiadas',
            'ver_reportes'
        ];

        foreach ($permisos as $permiso) {
            $permisoId = DB::table('permisos')->insertGetId([
                'nombrePermiso' => $permiso,
                'estadoPermiso' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Relacionar permiso con rol "Administrador"
            DB::table('roles_permisos')->insert([
                'idRol' => $adminRolId,
                'idPermiso' => $permisoId
            ]);
        }

        // Crear usuario administrador
        DB::table('usuarios')->insert([
            'idRol' => $adminRolId,
            'nombreUsuario' => 'admin',
            'nombre' => 'Administrador',
            'email' => 'admin@olimpiadas.com',
            'password' => bcrypt('password'),
            'estadoUsuario' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
};
