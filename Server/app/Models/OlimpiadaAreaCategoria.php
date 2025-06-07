<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OlimpiadaAreaCategoria extends Model
{
    use HasFactory;

    protected $table = 'olimpiadas_areas_categorias';
    protected $primaryKey = 'idOlimpAreaCategoria';
    public $timestamps = false;

    protected $fillable = [
        'idOlimpiada',
        'idArea',
        'idCategoria',
        'estado',
        'costo',
    ];

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('estado', true);
    }

    public function scopePorOlimpiada($query, $idOlimpiada)
    {
        return $query->where('idOlimpiada', $idOlimpiada);
    }

    public function scopePorArea($query, $idArea)
    {
        return $query->where('idArea', $idArea);
    }

    // Relaciones
    public function olimpiada()
    {
        return $this->belongsTo(Olimpiada::class, 'idOlimpiada');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'idArea');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria');
    }
}