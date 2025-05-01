<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'inscripciones';

    protected $primaryKey = 'idInscripcion';
    protected $fillable = [
        'idTutorResponsable',
        'idOlimpista',
        'idOlimpAreaCategoria',
        'estadoInscripcion',
        'idTutorLegal',
        'idTutorArea'
    ];

    public function olimpista()
    {
        return $this->belongsTo(Olimpista::class, 'idOlimpista', 'idOlimpista');
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idPersona');
    }

    public function tutorResponsable()
    {
        return $this->belongsTo(Tutor::class, 'idTutorResponsable', 'idTutor');
    }

    public function tutorLegal()
    {
        return $this->belongsTo(Tutor::class, 'idTutorLegal', 'idTutor');
    }

    public function tutorArea()
    {
        return $this->belongsTo(Tutor::class, 'idTutorArea', 'idTutor');
    }

    public function OlimpiadaAreaCategoria()
    {
        return $this->belongsTo(OlimpiadaAreaCategoria::class, 'idOlimpAreaCategoria');
    }

    public function area()
    {
        return $this->hasOneThrough(
            Area::class,
            OlimpiadaAreaCategoria::class,
            'idOlimpAreaCategoria', // FK en AreaCategoria hacia Inscripcion
            'idArea',            // PK en Area
            'idOlimpAreaCategoria',  // FK en Inscripcion
            'idArea'            // FK en AreaCategoria hacia Area
        );
    }

    public function logInscripcion()
    {
        Log::info('Procesando inscripción:', [
            'idInscripcion' => $this->idInscripcion,
            'area' => $this->area,
            'categoria' => $this->categoria,
            'datos_completos' => $this
        ]);
    }
}
