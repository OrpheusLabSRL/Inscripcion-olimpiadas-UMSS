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

    // Opcionalmente podrías agregar relaciones inversas, por ejemplo:
    // public function usuarios()
    // {
    //     return $this->hasMany(Usuario::class, 'idRol', 'idRol');
    // }
}
