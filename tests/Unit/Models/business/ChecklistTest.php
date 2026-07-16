<?php

use App\Models\business\Checklist;
use App\Models\business\State;
use App\Models\User;

describe('Checklist Model', function () {
    test('can create checklist with factory', function () {
        $checklist = Checklist::factory()->create();

        expect($checklist)->toBeInstanceOf(Checklist::class)
            ->and($checklist->user_id)->toBeInt()
            ->and($checklist->state_id)->toBeInt();
    });

    test('has correct fillable attributes', function () {
        $checklist = new Checklist;
        $expected = ['user_id', 'name', 'state_id'];

        expect($checklist->getFillable())->toBe($expected);
    });

    test('belongs to a user', function () {
        $user = User::factory()->create();
        $checklist = Checklist::factory()->create(['user_id' => $user->id]);

        expect($checklist->user)->toBeInstanceOf(User::class)
            ->and($checklist->user->id)->toBe($user->id);
    });

    test('belongs to a state', function () {
        $checklist = Checklist::factory()->open()->create();

        expect($checklist->state)->toBeInstanceOf(State::class)
            ->and($checklist->state->name)->toBe(State::CHECKLIST_OPEN);
    });

    test('scopeForUser filters by user', function () {
        $user = User::factory()->create();
        Checklist::factory()->create(['user_id' => $user->id]);
        Checklist::factory()->create();

        expect(Checklist::forUser($user->id)->get())->toHaveCount(1);
    });

    test('scopeInState filters by state name', function () {
        Checklist::factory()->open()->create();
        Checklist::factory()->closed()->create();

        $open = Checklist::inState(State::CHECKLIST_OPEN)->get();

        expect($open)->toHaveCount(1)
            ->and($open->first()->state->name)->toBe(State::CHECKLIST_OPEN);
    });

    test('uses correct table name', function () {
        $checklist = new Checklist;

        expect($checklist->getTable())->toBe('checklists');
    });
});
