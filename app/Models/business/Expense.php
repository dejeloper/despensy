<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'quantity',
        'unit_id',
        'place_id',
        'consumer_id',
        'total_price',
        'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function consumer()
    {
        return $this->belongsTo(Consumer::class);
    }
}
