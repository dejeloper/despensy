<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'checklist_id',
        'product_id',
        'quantity_planned',
        'unit_id_planned',
        'quantity_at_home',
        'unit_id_at_home',
        'was_bought',
        'quantity_bought',
        'unit_id_bought',
        'place_id',
        'unit_price',
        'total_price',
        'purchase_date',
    ];

    protected $casts = [
        'was_bought' => 'boolean',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'purchase_date' => 'date',
    ];

    /**
     * Get the checklist this item belongs to.
     */
    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }

    /**
     * Get the product being purchased.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the unit that was planned when the item was added to the list.
     */
    public function unitPlanned()
    {
        return $this->belongsTo(Unit::class, 'unit_id_planned');
    }

    /**
     * Get the unit the item was actually purchased in (can differ from planned).
     */
    public function unitBought()
    {
        return $this->belongsTo(Unit::class, 'unit_id_bought');
    }

    /**
     * Get the unit for the quantity the user noted having at home. Purely
     * informational — see docs/DOMAIN.md, it never accumulates automatically.
     */
    public function unitAtHome()
    {
        return $this->belongsTo(Unit::class, 'unit_id_at_home');
    }

    /**
     * Get the place where the item was purchased.
     */
    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    /**
     * Scope a query to items already marked as bought.
     */
    public function scopeBought($query)
    {
        return $query->where('was_bought', true);
    }
}
