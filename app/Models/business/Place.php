<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
	use HasFactory;

	protected $fillable = [
		'name',
		'short_name',
		'address',
		'bg_color',
		'text_color',
		'note',
		'enabled'
	];

	protected $casts = [
		'enabled' => 'boolean',
	];

	/**
	 * Get the products for the place.
	 */
	public function products()
	{
		return $this->hasMany(Product::class);
	}

	/**
	 * Get the count of products for the place.
	 */
	public function getProductsCountAttribute()
	{
		return $this->products()->count();
	}

	/**
	 * Scope a query to only include enabled places.
	 */
	public function scopeEnabled($query)
	{
		return $query->where('enabled', true);
	}

	/**
	 * Scope a query to search places by name or address.
	 */
	public function scopeSearch($query, $search)
	{
		return $query->where(function ($q) use ($search) {
			$q->where('name', 'like', "%{$search}%")
				->orWhere('address', 'like', "%{$search}%");
		});
	}
}
