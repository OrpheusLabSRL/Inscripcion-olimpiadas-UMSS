<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Olimpiada extends Model
{
    use HasFactory;

    protected $table = 'olimpiadas';

    protected $fillable = [
        'nombreOlimpiada',
        'version',
        'estadoOlimpiada',
        'fechaInicioOlimp',
        'fechaFinOlimp',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($olimpiada) {
            if ($olimpiada->fechaFinOlimp <= $olimpiada->fechaInicioOlimp) {
                throw new \Exception("La fecha de fin debe ser mayor que la fecha de inicio.");
            }
        });
    }

    public function areas()
    {
        return $this->hasMany(Area::class, 'idOlimpiada', 'idOlimpiada');
    }
}
