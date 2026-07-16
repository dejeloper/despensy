<?php

use App\Models\business\Place;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard/places')->assertRedirect('/login');
});

test('authenticated user can view the places list', function () {
    $user = User::factory()->create();
    Place::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard/places')
        ->assertOk();
});

test('store creates a place', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/places', [
            'name' => 'Supermercado Uno',
            'short_name' => 'Uno',
            'bg_color' => '#FFFFFF',
            'text_color' => '#000000',
            'enabled' => true,
        ])
        ->assertRedirect(route('places.index'));

    expect(Place::where('name', 'Supermercado Uno')->exists())->toBeTrue();
});

test('store fails validation with an invalid color', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/places', [
            'name' => 'Supermercado Dos',
            'short_name' => 'Dos',
            'bg_color' => 'not-a-color',
            'text_color' => '#000000',
            'enabled' => true,
        ])
        ->assertSessionHasErrors('bg_color');
});

test('update modifies an existing place', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create(['name' => 'Original']);

    $this->actingAs($user)
        ->put("/dashboard/places/{$place->id}", [
            'name' => 'Actualizado',
            'short_name' => $place->short_name,
            'bg_color' => $place->bg_color,
            'text_color' => $place->text_color,
            'enabled' => true,
        ])
        ->assertRedirect(route('places.index'));

    expect($place->fresh()->name)->toBe('Actualizado');
});

test('destroy deletes a place', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $this->actingAs($user)
        ->delete("/dashboard/places/{$place->id}")
        ->assertRedirect(route('places.index'));

    expect(Place::find($place->id))->toBeNull();
});
