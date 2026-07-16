<?php

use App\Models\business\State;

describe('State Model', function () {
    test('can create state with factory', function () {
        $state = State::factory()->create();

        expect($state)->toBeInstanceOf(State::class)
            ->and($state->name)->toBeString()
            ->and($state->type)->toBe(State::TYPE_CHECKLIST)
            ->and($state->enabled)->toBeBool();
    });

    test('has correct fillable attributes', function () {
        $state = new State;
        $expected = [
            'name',
            'type',
            'color',
            'icon',
            'enabled',
        ];

        expect($state->getFillable())->toBe($expected);
    });

    test('scopeOfType filters by type', function () {
        State::factory()->create(['type' => State::TYPE_CHECKLIST]);
        State::factory()->create(['type' => 'OTHER']);

        $result = State::ofType(State::TYPE_CHECKLIST)->get();

        expect($result)->toHaveCount(1)
            ->and($result->first()->type)->toBe(State::TYPE_CHECKLIST);
    });

    test('scopeEnabled filters disabled states out', function () {
        State::factory()->create(['enabled' => true]);
        State::factory()->create(['enabled' => false]);

        expect(State::enabled()->get())->toHaveCount(1);
    });

    test('uses correct table name', function () {
        $state = new State;

        expect($state->getTable())->toBe('states');
    });
});
