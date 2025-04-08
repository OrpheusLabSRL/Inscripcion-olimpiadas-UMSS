<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    use HasFactory;

    protected $table = 'tutores';

    protected $primaryKey = 'id_tutor';

    protected $fillable = [
        'nombre',
        'apellido',
        'tipoTutor',
        'correo',
        'numeroCelular',
        'carnetIdentidad'
    ];


    public function olimpistas()
{
    return $this->belongsToMany(Olimpista::class, 'olimpista_tutor', 'id_tutor', 'id_olimpista');
}

}
