<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    // Nombre de la tabla
    protected $table = 'roles';

    // Clave primaria personalizada
    protected $primaryKey = 'idRol';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'nombreRol',
        'descripcionRol',
        'estadoRol',
    ];

    // Manejar timestamps automáticamente
    public $timestamps = true;

    // Relación: Un Rol puede tener muchos Usuarios
     public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'roles_permisos', 'idRol', 'idPermiso');
    }

    public function usuarios()
    {
        return $this->hasMany(User::class, 'idRol');
    }
}
