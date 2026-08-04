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
     * Get the system's currently open checklist (state "Abierta" or "En
     * Progreso"), if any. The system has at most one at a time, shared by
     * every authenticated user regardless of who created it.
     */
    public function openChecklistFor(): ?Checklist
    {
        return Checklist::whereHas('state', function ($query) {
            $query->whereIn('name', [State::CHECKLIST_OPEN, State::CHECKLIST_IN_PROGRESS]);
        })
            ->latest()
            ->first();
    }

    /**
     * Count the items in the system's open checklist (0 if none is open).
     * Used to show a badge in the navigation.
     */
    public function openChecklistItemsCountFor(): int
    {
        return $this->openChecklistFor()?->items()->count() ?? 0;
    }

    /**
     * Get the system's open checklist, creating one if none exists yet. Used
     * by entry points (like Despensa) that need a checklist to write to
     * without requiring anyone to have visited /checklists/active first.
     */
    public function activeChecklistFor(User $user): Checklist
    {
        return $this->openChecklistFor() ?? $this->openNewFor($user);
    }

    /**
     * Whether a checklist hasn't been touched in more than 15 days. Used to
     * prompt the user to keep working on it or start a fresh one.
     */
    public function isStale(Checklist $checklist): bool
    {
        return $checklist->updated_at->diffInDays(now()) > 15;
    }

    /**
     * Open a new checklist, attributed to the given user as its creator. If
     * one is already open, it gets closed first — the system can only have
     * one open checklist at a time, shared by everyone.
     */
    public function openNewFor(User $user, ?string $name = null): Checklist
    {
        $currentlyOpen = $this->openChecklistFor();

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
