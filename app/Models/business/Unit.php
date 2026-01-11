<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name',
        'enabled'
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    /**
     * Get the products for the unit.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the count of products for the unit.
     */
    public function getProductsCountAttribute()
    {
        return $this->products()->count();
    }

    /**
     * Scope a query to only include enabled units.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope a query to search units by name or short name.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('short_name', 'like', "%{$search}%");
        });
    }
}
