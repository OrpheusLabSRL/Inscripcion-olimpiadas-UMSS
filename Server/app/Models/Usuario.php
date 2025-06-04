<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    // Nombre de la tabla asociada
    protected $table = 'usuarios';

    // Clave primaria personalizada
    protected $primaryKey = 'idUsuario';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idRol',
        'nombreUsuario',
        'nombre',
        'email',
        'password',
        'estadoUsuario',
    ];

    // Indica si el modelo debe manejar timestamps automáticamente
    public $timestamps = true;

    // Relación: Un Usuario pertenece a un Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'idRol', 'idRol');
    }

     public function hasRole($rolNombre)
    {
        return optional($this->rol)->nombreRol === $rolNombre;
    }

    // Obtener permisos a través del rol
    public function permisos()
    {
        return $this->rol ? $this->rol->permisos : collect();
    }

    public function hasPermiso($permisoNombre)
    {
        return $this->permisos()->contains('nombrePermiso', $permisoNombre);
    }

    // Ocultar atributos sensibles al devolver el modelo como JSON
    protected $hidden = [
        'password',
    ];
}
