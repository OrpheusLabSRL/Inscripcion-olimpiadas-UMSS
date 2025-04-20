<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $primaryKey = 'idPersona';
    protected $fillable = [
        'nombre',
        'apellido',
        'carnetIdentidad',
        'correoElectronico'
    ];

   
    public function olimpista()
    {
        return $this->hasOne(Olimpista::class, 'idPersona');
    }

    public function tutor()
    {
        return $this->hasOne(Tutor::class, 'idPersona');
    }
}