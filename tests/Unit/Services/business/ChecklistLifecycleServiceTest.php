<?php

use App\Models\business\Checklist;
use App\Models\business\State;
use App\Models\User;
use App\Services\business\ChecklistLifecycleService;

describe('ChecklistLifecycleService', function () {
    beforeEach(function () {
        seedChecklistStates();
    });

    test('openChecklistFor returns null when the user has no open checklist', function () {
        $user = User::factory()->create();

        $result = (new ChecklistLifecycleService)->openChecklistFor($user);

        expect($result)->toBeNull();
    });

    test('openNewFor creates a checklist in the open state', function () {
        $user = User::factory()->create();

        $checklist = (new ChecklistLifecycleService)->openNewFor($user, 'Mercado de la semana');

        expect($checklist->user_id)->toBe($user->id)
            ->and($checklist->name)->toBe('Mercado de la semana')
            ->and($checklist->state->name)->toBe(State::CHECKLIST_OPEN);
    });

    test('openChecklistFor finds the checklist that was just opened', function () {
        $user = User::factory()->create();
        $created = (new ChecklistLifecycleService)->openNewFor($user);

        $found = (new ChecklistLifecycleService)->openChecklistFor($user);

        expect($found->id)->toBe($created->id);
    });

    test('opening a new checklist closes the previously open one', function () {
        $user = User::factory()->create();
        $service = new ChecklistLifecycleService;

        $first = $service->openNewFor($user, 'Primera lista');
        $second = $service->openNewFor($user, 'Segunda lista');

        $first->refresh();

        expect($first->state->name)->toBe(State::CHECKLIST_CLOSED)
            ->and($second->state->name)->toBe(State::CHECKLIST_OPEN)
            ->and($service->openChecklistFor($user)->id)->toBe($second->id);
    });

    test('does not affect other users open checklists', function () {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $service = new ChecklistLifecycleService;

        $checklistA = $service->openNewFor($userA);
        $service->openNewFor($userB);

        $checklistA->refresh();

        expect($checklistA->state->name)->toBe(State::CHECKLIST_OPEN);
    });

    test('complete sets the checklist to closed', function () {
        $checklist = Checklist::factory()->open()->create();

        (new ChecklistLifecycleService)->complete($checklist);

        expect($checklist->fresh()->state->name)->toBe(State::CHECKLIST_CLOSED);
    });

    test('cancel sets the checklist to cancelled', function () {
        $checklist = Checklist::factory()->open()->create();

        (new ChecklistLifecycleService)->cancel($checklist);

        expect($checklist->fresh()->state->name)->toBe(State::CHECKLIST_CANCELLED);
    });
});
