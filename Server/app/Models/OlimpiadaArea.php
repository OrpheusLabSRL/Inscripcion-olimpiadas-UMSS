<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OlimpiadaArea extends Model
{
    use HasFactory;

    protected $table = 'olimpiada_area';
    protected $primaryKey = 'idOlimpArea';
    public $timestamps = false;

    protected $fillable = [
        'idArea',
        'idOlimpiada',
        'estadoOlimpArea'
    ];

    // Relaciones inversas
    public function olimpiada()
    {
        return $this->belongsTo(Olimpiada::class, 'idOlimpiada', 'idOlimpiada');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'idArea', 'idArea');
    }
}
