<?php

use App\Models\business\Checklist;
use App\Models\business\State;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('guests are redirected to the login page', function () {
    $this->get('/dashboard/checklists')->assertRedirect('/login');
});

test('authenticated user can view their checklists', function () {
    $user = User::factory()->create();
    Checklist::factory()->open()->create(['user_id' => $user->id]);
    Checklist::factory()->closed()->create(); // otro usuario, no debe aparecer

    $this->actingAs($user)
        ->get('/dashboard/checklists')
        ->assertOk();
});

test('store creates a new open checklist for the user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/checklists', ['name' => 'Mercado de la semana'])
        ->assertRedirect(route('despensy.index'));

    $checklist = Checklist::forUser($user->id)->first();

    expect($checklist->name)->toBe('Mercado de la semana')
        ->and($checklist->state->name)->toBe(State::CHECKLIST_OPEN);
});

test('store closes any previously open checklist for the same user', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post('/dashboard/checklists', ['name' => 'Primera']);
    $first = Checklist::forUser($user->id)->first();

    $this->post('/dashboard/checklists', ['name' => 'Segunda']);

    expect($first->fresh()->state->name)->toBe(State::CHECKLIST_CLOSED);
});

test('complete transitions the checklist to closed', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post("/dashboard/checklists/{$checklist->id}/complete")
        ->assertRedirect(route('checklists.index'));

    expect($checklist->fresh()->state->name)->toBe(State::CHECKLIST_CLOSED);
});

test('cancel transitions the checklist to cancelled', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post("/dashboard/checklists/{$checklist->id}/cancel")
        ->assertRedirect(route('checklists.index'));

    expect($checklist->fresh()->state->name)->toBe(State::CHECKLIST_CANCELLED);
});

test('show displays a checklist owned by the user', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->closed()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get("/dashboard/checklists/{$checklist->id}")
        ->assertOk();
});

test('a user cannot view another users checklist', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $checklist = Checklist::factory()->closed()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->get("/dashboard/checklists/{$checklist->id}")
        ->assertForbidden();
});

test('a user cannot complete another users checklist', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->post("/dashboard/checklists/{$checklist->id}/complete")
        ->assertForbidden();
});
