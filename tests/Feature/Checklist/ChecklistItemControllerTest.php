<?php

use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('store adds a product to the checklist', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->post("/dashboard/checklists/{$checklist->id}/items", [
            'product_id' => $product->id,
            'quantity_planned' => 2,
        ])
        ->assertRedirect();

    expect($checklist->items()->where('product_id', $product->id)->exists())->toBeTrue();
});

test('store fails with an error message when the checklist is closed', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->closed()->create(['user_id' => $user->id]);
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->post("/dashboard/checklists/{$checklist->id}/items", ['product_id' => $product->id])
        ->assertRedirect()
        ->assertSessionHas('error');

    expect($checklist->items()->count())->toBe(0);
});

test('a user cannot add items to another users checklist', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $owner->id]);
    $product = Product::factory()->create();

    $this->actingAs($intruder)
        ->post("/dashboard/checklists/{$checklist->id}/items", ['product_id' => $product->id])
        ->assertForbidden();
});

test('destroy removes the item from the checklist', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

    $this->actingAs($user)
        ->delete("/dashboard/checklists/{$checklist->id}/items/{$item->id}")
        ->assertRedirect();

    expect(ChecklistItem::find($item->id))->toBeNull();
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
            'unit_price' => 2500,
        ])
        ->assertRedirect();

    $item->refresh();

    expect($item->was_bought)->toBeTrue()
        ->and((float) $item->total_price)->toBe(7500.0);
});

test('markBought fails validation without required purchase fields', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

    $this->actingAs($user)
        ->patch("/dashboard/checklist-items/{$item->id}/mark-bought", [])
        ->assertSessionHasErrors(['quantity_bought', 'unit_id_bought', 'place_id', 'unit_price']);
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
            'unit_price' => 1000,
        ])
        ->assertForbidden();
});
