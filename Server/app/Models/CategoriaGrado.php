<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaGrado extends Model
{
    use HasFactory;

    protected $table = 'categoria_grado';
    protected $primaryKey = 'idCategoriaGrado';
    public $timestamps = false;

    protected $fillable = [
        'idCategoria',
        'idGrado',
        'estadoCategoriaGrado'
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria', 'idCategoria');
    }

    public function grado()
    {
        return $this->belongsTo(Grado::class, 'idGrado', 'idGrado');
    }
}
