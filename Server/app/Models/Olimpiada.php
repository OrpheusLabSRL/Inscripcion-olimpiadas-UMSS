<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaCategoria;

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

    // ✅ Nueva relación: olimpiada ↔ combinaciones (área + categoría)
    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idOlimpiada');
    }
}
