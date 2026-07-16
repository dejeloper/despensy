<?php

use App\Models\business\Unit;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard/units')->assertRedirect('/login');
});

test('authenticated user can view the units list', function () {
    $user = User::factory()->create();
    Unit::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard/units')
        ->assertOk();
});

test('store creates a unit', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/units', [
            'name' => 'Tonelada',
            'short_name' => 'Ton',
            'enabled' => true,
        ])
        ->assertRedirect(route('units.index'));

    expect(Unit::where('name', 'Tonelada')->exists())->toBeTrue();
});

test('store fails validation with a duplicate name', function () {
    $user = User::factory()->create();
    Unit::factory()->create(['name' => 'Kilogramo']);

    $this->actingAs($user)
        ->post('/dashboard/units', [
            'name' => 'Kilogramo',
            'short_name' => 'Kg2',
            'enabled' => true,
        ])
        ->assertSessionHasErrors('name');
});

test('update modifies an existing unit', function () {
    $user = User::factory()->create();
    $unit = Unit::factory()->create(['name' => 'Original']);

    $this->actingAs($user)
        ->put("/dashboard/units/{$unit->id}", [
            'name' => 'Actualizada',
            'short_name' => $unit->short_name,
            'enabled' => true,
        ])
        ->assertRedirect(route('units.index'));

    expect($unit->fresh()->name)->toBe('Actualizada');
});

test('destroy deletes a unit', function () {
    $user = User::factory()->create();
    $unit = Unit::factory()->create();

    $this->actingAs($user)
        ->delete("/dashboard/units/{$unit->id}")
        ->assertRedirect(route('units.index'));

    expect(Unit::find($unit->id))->toBeNull();
});
