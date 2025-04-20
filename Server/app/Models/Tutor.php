<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    use HasFactory;

    protected $table = 'tutores';
    protected $primaryKey = 'idPersona';
    public $incrementing = false;
    protected $fillable = [
        'tipoTutor',
        'idPersona',
        'telefono',
    ];

    // Relación con Persona
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idPersona');
    }

    // Relación con Inscripciones como tutor responsable
    public function inscripcionesResponsable()
    {
        return $this->hasMany(Inscripcion::class, 'idTutorResponsable');
    }

    // Relación con Inscripciones como tutor legal
    public function inscripcionesLegal()
    {
        return $this->hasMany(Inscripcion::class, 'idTutorLegal');
    }
    
    public function inscripcionesArea()
    {
        return $this->hasMany(Inscripcion::class, 'idTutorArea');
    }
}