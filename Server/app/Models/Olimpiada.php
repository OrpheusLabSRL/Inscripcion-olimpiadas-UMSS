<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaCategoria;
use App\Models\Usuario;

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

    public static function boot()
    {
        parent::boot();

        static::creating(function ($olimpiada) {
            if ($olimpiada->fechaFinOlimpiada <= $olimpiada->fechaInicioOlimpiada) {
                throw new \Exception("La fecha de fin debe ser mayor que la fecha de inicio.");
            }

            if (empty($olimpiada->idUsuario)) {
                throw new \Exception("El campo idUsuario es requerido.");
            }
        });
    }

    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idOlimpiada');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }
}