<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductContainer extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'place_id',
        'container_unit_id',
        'content_quantity',
        'content_unit_id',
    ];

    protected $casts = [
        'content_quantity' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function containerUnit()
    {
        return $this->belongsTo(Unit::class, 'container_unit_id');
    }

    public function contentUnit()
    {
        return $this->belongsTo(Unit::class, 'content_unit_id');
    }
}
