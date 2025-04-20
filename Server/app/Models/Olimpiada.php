<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaCategoria;

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
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($olimpiada) {
            if ($olimpiada->fechaFinOlimpiada <= $olimpiada->fechaInicioOlimpiada) {
                throw new \Exception("La fecha de fin debe ser mayor que la fecha de inicio.");
            }
        });
    }

    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idOlimpiada');
    }
}
