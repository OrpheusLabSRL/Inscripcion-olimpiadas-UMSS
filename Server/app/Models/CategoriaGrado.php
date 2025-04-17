<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaGrado extends Model
{
    use HasFactory;

    protected $table = 'categoria_grados';
    protected $primaryKey = 'id_CategoriaGrado';
    public $timestamps = false;

    protected $fillable = [
        'categoria_id',
        'grado_id',
        'max_participantes',
        'estadoCategoriaGrado'
    ];

    public function categoria()
{
    return $this->belongsTo(Categoria::class, 'categoria_id', 'idCategoria');
}


    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado_id', 'idGrado');
    }
}
