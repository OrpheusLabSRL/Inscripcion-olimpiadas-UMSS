<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Olimpiada extends Model
{
    use HasFactory;

    protected $table = 'olimpiada';
    protected $primaryKey = 'idOlimpiada';
    public $timestamps = false;

    protected $fillable = [
        'nombreOlimpiada',
        'version',
        'estadoOlimpiada',
        'fechaInicioOlimp',
        'fechaFinOlimp',
    ];

    // Validación de fechas antes de guardar
    public static function boot()
    {
        parent::boot();

        static::creating(function ($olimpiada) {
            if ($olimpiada->fechaFinOlimp <= $olimpiada->fechaInicioOlimp) {
                throw new \Exception("La fecha de fin debe ser mayor que la fecha de inicio.");
            }
        });
    }

    // Relación con áreas mediante la tabla pivote olimpiada_area
    public function areas()
    {
        return $this->belongsToMany(
            Area::class,
            'olimpiada_area',
            'idOlimpiada',
            'idArea'
        )->withPivot('estadoOlimpArea');
    }
}
