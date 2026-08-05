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

test('authenticated user can view checklists created by anyone', function () {
    $user = User::factory()->create();
    Checklist::factory()->open()->create(['user_id' => $user->id]);
    Checklist::factory()->closed()->create(); // creada por otro usuario, debe aparecer igual

    $this->actingAs($user)
        ->get('/dashboard/checklists')
        ->assertOk();
});

test('store creates a new open checklist attributed to the user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/dashboard/checklists', ['name' => 'Mercado de la semana'])
        ->assertRedirect(route('despensy.index'));

    $checklist = Checklist::latest()->first();

    expect($checklist->user_id)->toBe($user->id)
        ->and($checklist->name)->toBe('Mercado de la semana')
        ->and($checklist->state->name)->toBe(State::CHECKLIST_OPEN);
});

test('store closes the previously open checklist, regardless of who created it', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post('/dashboard/checklists', ['name' => 'Primera']);
    $first = Checklist::latest()->first();

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

test('show displays a checklist created by another user', function () {
    $creator = User::factory()->create();
    $viewer = User::factory()->create();
    $checklist = Checklist::factory()->closed()->create(['user_id' => $creator->id]);

    $this->actingAs($viewer)
        ->get("/dashboard/checklists/{$checklist->id}")
        ->assertOk();
});

test('a user can complete a checklist created by another user', function () {
    $creator = User::factory()->create();
    $collaborator = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $creator->id]);

    $this->actingAs($collaborator)
        ->post("/dashboard/checklists/{$checklist->id}/complete")
        ->assertRedirect(route('checklists.index'));

    expect($checklist->fresh()->state->name)->toBe(State::CHECKLIST_CLOSED);
});
