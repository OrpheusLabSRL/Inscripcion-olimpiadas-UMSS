<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class OlimpistaTutor extends Pivot
{
    protected $table = 'olimpista_tutor';
    public $incrementing = false;
    protected $primaryKey = ['id_tutor', 'id_olimpista', 'rol'];

    public $timestamps = false;
    protected $fillable = [
        'id_tutor',
        'id_olimpista',
        'estado',
        'rol',
    ];

    public function tutor()
{
    return $this->belongsTo(Tutor::class, 'id_tutor');
}
}
