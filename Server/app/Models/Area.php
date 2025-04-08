<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'areas';

    protected $primaryKey = 'idArea';

    protected $fillable = [
        'idOlimpiada',
        'nombreArea',
        'descripcionArea',
        'costoArea',
        'estadoArea',
    ];

    // Relacion: Un área pertenece a una Olimpiada
    public function olimpiada()
    {
        return $this->belongsTo(Olimpiada::class, 'idOlimpiada', 'idOlimpiada');
    }

    public function categorias()
{
    return $this->belongsToMany(Categoria::class, 'area_categoria', 'area_id', 'categoria_id')
                ->withPivot('estadoAreaCategoria')->withTimestamps();
}
}
