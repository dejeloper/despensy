<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
        'category_id',
        'place_id',
        'unit_id',
        'enabled',
        'price',
        'stock'
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the place that owns the product.
     */
    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    /**
     * Get the unit that owns the product.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Scope a query to only include enabled products.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope a query to search products by name or description.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to filter products by category.
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope a query to filter products by place.
     */
    public function scopeByPlace($query, $placeId)
    {
        return $query->where('place_id', $placeId);
    }

    /**
     * Scope a query to filter products by unit.
     */
    public function scopeByUnit($query, $unitId)
    {
        return $query->where('unit_id', $unitId);
    }

    /**
     * Scope a query to filter products with low stock.
     */
    public function scopeLowStock($query, $threshold = 10)
    {
        return $query->where('stock', '<=', $threshold);
    }

    /**
     * Check if the product has low stock.
     */
    public function hasLowStock($threshold = 10)
    {
        return $this->stock <= $threshold;
    }

    /**
     * Get the total value of the product (price * stock).
     */
    public function getTotalValueAttribute()
    {
        return $this->price * $this->stock;
    }
}
