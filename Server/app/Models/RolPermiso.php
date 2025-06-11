<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolPermiso extends Model
{
    protected $table = 'roles_permisos';

    protected $primaryKey = 'idRolPermiso';

    protected $fillable = [
        'idRol',
        'idPermiso',
        'estadoRolPermiso',
    ];

    // Si quieres controlar los timestamps
    public $timestamps = true;

    // Relaciones (asumiendo que tienes modelos Rol y Permiso)
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'idRol', 'idRol');
    }

    public function permiso()
    {
        return $this->belongsTo(Permiso::class, 'idPermiso', 'idPermiso');
    }
}
