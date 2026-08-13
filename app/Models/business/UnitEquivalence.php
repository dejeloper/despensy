<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitEquivalence extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'parent_unit_id',
        'factor',
    ];

    protected $casts = [
        'factor' => 'float',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function parent()
    {
        return $this->belongsTo(Unit::class, 'parent_unit_id');
    }
}
