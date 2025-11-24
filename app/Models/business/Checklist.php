<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Checklist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'nombre',
        'total_estimado',
        'total_real',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(ChecklistDetail::class);
    }
}
