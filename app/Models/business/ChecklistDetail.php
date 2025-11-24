<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'checklist_id',
        'product_id',
        'reported_stock',
        'to_buy',
        'quantity_planned',
        'quantity_bought',
        'price_paid',
        'place_id',
        'place_suggested_id',
        'unit_suggested_id',
        'is_processed',
    ];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
    public function suggestedPlace()
    {
        return $this->belongsTo(Place::class, 'place_suggested_id');
    }

    public function suggestedUnit()
    {
        return $this->belongsTo(Unit::class, 'unit_suggested_id');
    }

    public function confirmation()
    {
        return $this->hasOne(ChecklistItemConfirmation::class, 'checklist_item_id');
    }
}

