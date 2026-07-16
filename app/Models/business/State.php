<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    /**
     * State types this catalog currently serves. New entity groups (e.g. a
     * future "PRODUCT" type) get their own constant here instead of a
     * hardcoded string elsewhere.
     */
    const TYPE_CHECKLIST = 'CHECKLIST';

    /**
     * Known state names for the CHECKLIST type (see StateSeeder). Business
     * code should reference these constants instead of comparing raw strings.
     */
    const CHECKLIST_OPEN = 'Abierta';

    const CHECKLIST_IN_PROGRESS = 'En Progreso';

    const CHECKLIST_CLOSED = 'Cerrada';

    const CHECKLIST_CANCELLED = 'Cancelada';

    protected $fillable = [
        'name',
        'type',
        'color',
        'icon',
        'enabled',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    /**
     * Get the checklists in this state.
     */
    public function checklists()
    {
        return $this->hasMany(Checklist::class);
    }

    /**
     * Scope a query to only include enabled states.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope a query to filter states by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
