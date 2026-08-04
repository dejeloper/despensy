<?php

namespace App\Models\business;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'state_id',
    ];

    /**
     * Get the user who created the checklist. Informational only — the
     * checklist itself is shared and editable by every authenticated user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the state of the checklist (open, in progress, closed, cancelled).
     */
    public function state()
    {
        return $this->belongsTo(State::class);
    }

    /**
     * Get the items (products) in this checklist.
     */
    public function items()
    {
        return $this->hasMany(ChecklistItem::class);
    }

    /**
     * Scope a query to checklists currently in the given state name
     * (joins against the states catalog by name).
     */
    public function scopeInState($query, string $stateName)
    {
        return $query->whereHas('state', function ($q) use ($stateName) {
            $q->where('name', $stateName);
        });
    }
}
