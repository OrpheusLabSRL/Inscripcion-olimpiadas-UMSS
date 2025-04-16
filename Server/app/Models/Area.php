<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaCategoria;

class Area extends Model
{
    use HasFactory;

    protected $table = 'area';
    protected $primaryKey = 'idArea';
    public $timestamps = false;

    protected $fillable = [
        'nombreArea',
        'descripcionArea',
        'costoArea',
        'estadoArea',
    ];

    // Nueva relación: combinaciones (olimpiada + área + categoría)
    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idArea');
    }
}
