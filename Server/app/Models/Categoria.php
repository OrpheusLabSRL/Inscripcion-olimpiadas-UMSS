<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OlimpiadaAreaCategoria;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'idCategoria';
    public $timestamps = false;

    protected $fillable = [
        'nombreCategoria',
        'estadoCategoria',
    ];

    // 🔁 Relación con grados (tabla intermedia: categoria_grado)
    public function grados()
    {
        return $this->belongsToMany(Grado::class, 'categorias_grados', 'categoria_id', 'grado_id')
            ->withPivot('estadoCategoriaGrado');

    }

    // 🔁 Relación con combinaciones (olimpiada + área + categoría)
    public function combinaciones()
    {
        return $this->hasMany(OlimpiadaAreaCategoria::class, 'idCategoria');
    }
}
