<?php

namespace App\Services\business;

use App\Models\business\Checklist;
use App\Models\business\State;
use App\Models\User;

/**
 * Owns every state transition a Checklist can go through: opening a new
 * one (closing whatever was open before), completing it, and cancelling
 * it. See docs/DOMAIN.md for the allowed transitions.
 */
class ChecklistLifecycleService
{
    /**
     * Get the user's currently open checklist (state "Abierta" or "En
     * Progreso"), if any. A user has at most one at a time.
     */
    public function openChecklistFor(User $user): ?Checklist
    {
        return Checklist::forUser($user->id)
            ->whereHas('state', function ($query) {
                $query->whereIn('name', [State::CHECKLIST_OPEN, State::CHECKLIST_IN_PROGRESS]);
            })
            ->latest()
            ->first();
    }

    /**
     * Count the items in the user's open checklist (0 if none is open).
     * Used to show a badge in the navigation.
     */
    public function openChecklistItemsCountFor(User $user): int
    {
        return $this->openChecklistFor($user)?->items()->count() ?? 0;
    }

    /**
     * Open a new checklist for the user. If one is already open, it gets
     * closed first — a user can only have one open checklist at a time.
     */
    public function openNewFor(User $user, ?string $name = null): Checklist
    {
        $currentlyOpen = $this->openChecklistFor($user);

        if ($currentlyOpen) {
            $this->complete($currentlyOpen);
        }

        return Checklist::create([
            'user_id' => $user->id,
            'name' => $name,
            'state_id' => $this->stateIdFor(State::CHECKLIST_OPEN),
        ]);
    }

    /**
     * Mark a checklist as completed (state "Cerrada"). Immutable afterwards.
     */
    public function complete(Checklist $checklist): Checklist
    {
        $checklist->update(['state_id' => $this->stateIdFor(State::CHECKLIST_CLOSED)]);

        return $checklist;
    }

    /**
     * Cancel a checklist (state "Cancelada") — no purchase data gets kept
     * as a record of "the plan". Immutable afterwards.
     */
    public function cancel(Checklist $checklist): Checklist
    {
        $checklist->update(['state_id' => $this->stateIdFor(State::CHECKLIST_CANCELLED)]);

        return $checklist;
    }

    private function stateIdFor(string $name): int
    {
        return State::enabled()
            ->ofType(State::TYPE_CHECKLIST)
            ->where('name', $name)
            ->firstOrFail()
            ->id;
    }
}
