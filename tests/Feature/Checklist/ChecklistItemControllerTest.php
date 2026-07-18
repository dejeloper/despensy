<?php

use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Unit;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('markBought fills purchase data', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);
    $place = Place::factory()->create();
    $unit = Unit::factory()->create();

    $this->actingAs($user)
        ->patch("/dashboard/checklist-items/{$item->id}/mark-bought", [
            'quantity_bought' => 3,
            'unit_id_bought' => $unit->id,
            'place_id' => $place->id,
            'total_price' => 7500,
        ])
        ->assertRedirect();

    $item->refresh();

    expect($item->was_bought)->toBeTrue()
        ->and((float) $item->total_price)->toBe(7500.0)
        ->and((float) $item->unit_price)->toBe(2500.0);
});

test('markBought fails validation without required purchase fields', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

    $this->actingAs($user)
        ->patch("/dashboard/checklist-items/{$item->id}/mark-bought", [])
        ->assertSessionHasErrors(['quantity_bought', 'unit_id_bought', 'place_id', 'total_price']);
});

test('markNotBought clears purchase data', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $item = ChecklistItem::factory()->bought()->create(['checklist_id' => $checklist->id]);

    $this->actingAs($user)
        ->patch("/dashboard/checklist-items/{$item->id}/mark-not-bought")
        ->assertRedirect();

    expect($item->fresh()->was_bought)->toBeFalse();
});

test('markBought flashes an error instead of a raw 404 when the item no longer exists', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/dashboard/checklist-items/999999/mark-bought', [
            'quantity_bought' => 1,
            'unit_id_bought' => Unit::factory()->create()->id,
            'place_id' => Place::factory()->create()->id,
            'total_price' => 1000,
        ])
        ->assertRedirect()
        ->assertSessionHas('error');
});

test('markNotBought flashes an error instead of a raw 404 when the item no longer exists', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch('/dashboard/checklist-items/999999/mark-not-bought')
        ->assertRedirect()
        ->assertSessionHas('error');
});

test('a user cannot mark another users item as bought', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $owner->id]);
    $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

    $this->actingAs($intruder)
        ->patch("/dashboard/checklist-items/{$item->id}/mark-bought", [
            'quantity_bought' => 1,
            'unit_id_bought' => Unit::factory()->create()->id,
            'place_id' => Place::factory()->create()->id,
            'total_price' => 1000,
        ])
        ->assertForbidden();
});
