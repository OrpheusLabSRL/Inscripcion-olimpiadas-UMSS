<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    protected $table = 'permisos';
    protected $primaryKey = 'idPermiso';

    protected $fillable = [
        'nombrePermiso',
        'estadoPermiso',
    ];

    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'rol_permiso', 'idPermiso', 'idRol');
    }
}
