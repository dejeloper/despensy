<?php

use App\Models\business\Category;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('guests are redirected to the login page', function () {
    $this->get('/despensy')->assertRedirect('/login');
});

test('viewing despensy creates an open checklist when the user has none', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/despensy')
        ->assertOk();

    expect(Checklist::forUser($user->id)->count())->toBe(1);
});

test('viewing despensy reuses the existing open checklist', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);

    $this->actingAs($user)->get('/despensy')->assertOk();

    expect(Checklist::forUser($user->id)->count())->toBe(1)
        ->and(Checklist::forUser($user->id)->first()->id)->toBe($checklist->id);
});

test('updateProductState adds a product to the checklist without visiting it first', function () {
    $user = User::factory()->create();
    $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
    $unit = Unit::factory()->create();

    $this->actingAs($user)
        ->put("/despensy/products/{$product->id}", [
            'will_buy' => true,
            'quantity_planned' => 2,
            'unit_id_planned' => $unit->id,
        ])
        ->assertRedirect();

    $checklist = Checklist::forUser($user->id)->first();

    expect($checklist)->not->toBeNull()
        ->and($checklist->items()->where('product_id', $product->id)->exists())->toBeTrue();
});

test('updateProductState reuses the already open checklist instead of creating another', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();

    $this->actingAs($user)
        ->put("/despensy/products/{$product->id}", ['will_buy' => true, 'quantity_planned' => 1])
        ->assertRedirect();

    expect(Checklist::forUser($user->id)->count())->toBe(1)
        ->and($checklist->items()->where('product_id', $product->id)->exists())->toBeTrue();
});

test('updateProductState removes the product from the checklist when will_buy is false', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
    $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id, 'product_id' => $product->id]);

    $this->actingAs($user)
        ->put("/despensy/products/{$product->id}", ['will_buy' => false])
        ->assertRedirect();

    expect(ChecklistItem::find($item->id))->toBeNull();
});

test('renewChecklist closes the stale checklist and opens a new one', function () {
    $user = User::factory()->create();
    $old = Checklist::factory()->open()->create(['user_id' => $user->id, 'updated_at' => now()->subDays(20)]);

    $this->actingAs($user)
        ->post('/despensy/checklist/renew')
        ->assertRedirect();

    expect($old->fresh()->state->name)->toBe(\App\Models\business\State::CHECKLIST_CLOSED)
        ->and(Checklist::forUser($user->id)->inState(\App\Models\business\State::CHECKLIST_OPEN)->count())->toBe(1);
});
