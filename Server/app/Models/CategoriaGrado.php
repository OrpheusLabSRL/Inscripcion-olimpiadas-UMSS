<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaGrado extends Model
{
    use HasFactory;

    protected $table = 'categorias_grados';
    protected $primaryKey = 'idCategoriaGrado';
    public $timestamps = false;

    protected $fillable = [
        'idCategoria',
        'idGrado',
        'estadoCategoriaGrado'
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estadoCategoriaGrado', true);
    }

    public function scopePorCategoria($query, $idCategoria)
    {
        return $query->where('idCategoria', $idCategoria);
    }

    public function scopePorGrado($query, $idGrado)
    {
        return $query->where('idGrado', $idGrado);
    }

    // Relaciones
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria', 'idCategoria');
    }

    public function grado()
    {
        return $this->belongsTo(Grado::class, 'idGrado', 'idGrado');
    }
}