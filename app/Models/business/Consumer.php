<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consumer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
    ];

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
