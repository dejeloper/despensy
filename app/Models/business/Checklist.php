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
     * Get the user that owns the checklist.
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
     * Scope a query to checklists belonging to a given user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
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
