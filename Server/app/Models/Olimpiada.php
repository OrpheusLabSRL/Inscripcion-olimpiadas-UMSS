<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Olimpiada extends Model
{
    use HasFactory;

    protected $table = 'olimpiadas';
    protected $primaryKey = 'idOlimpiada';
    public $timestamps = false;

    protected $fillable = [
        'nombreOlimpiada',
        'version',
        'estadoOlimpiada',
        'fechaInicioOlimpiada',
        'fechaFinOlimpiada',
        'idUsuario',
    ];

    protected $dates = [
        'fechaInicioOlimpiada',
        'fechaFinOlimpiada'
    ];

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('estadoOlimpiada', true);
    }

    public function scopePorNombre($query, $nombre)
    {
        return $query->where('nombreOlimpiada', 'like', "%$nombre%");
    }

    // Relaciones
    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idOlimpiada');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }
}