<?php

use App\Models\business\Category;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('guests are redirected to the login page', function () {
    $this->get('/despensy/checkout')->assertRedirect('/login');
});

test('index only lists items that are planned and not yet bought', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);
    $category = Category::factory()->create();

    $planned = ChecklistItem::factory()->create([
        'checklist_id' => $checklist->id,
        'product_id' => Product::factory()->withRelationships($category->id)->create()->id,
        'quantity_planned' => 2,
    ]);
    ChecklistItem::factory()->bought()->create([
        'checklist_id' => $checklist->id,
        'product_id' => Product::factory()->withRelationships($category->id)->create()->id,
        'quantity_planned' => 1,
    ]);
    ChecklistItem::factory()->create([
        'checklist_id' => $checklist->id,
        'product_id' => Product::factory()->withRelationships($category->id)->create()->id,
        'quantity_planned' => null,
    ]);

    $response = $this->actingAs($user)->get('/despensy/checkout')->assertOk();

    $items = $response->inertiaProps('items');

    expect($items)->toHaveCount(1)
        ->and($items[0]['id'])->toBe($planned->id);
});

test('addProduct creates an out-of-list item already marked as bought', function () {
    $user = User::factory()->create();
    Checklist::factory()->open()->create(['user_id' => $user->id]);
    $product = Product::factory()->create();
    $place = Place::factory()->create();
    $unit = Unit::factory()->create();

    $this->actingAs($user)->post('/despensy/checkout/products', [
        'product_id' => $product->id,
        'quantity_bought' => 2,
        'unit_id_bought' => $unit->id,
        'place_id' => $place->id,
        'total_price' => 3000,
    ])->assertRedirect();

    $item = ChecklistItem::where('product_id', $product->id)->first();

    expect($item)->not->toBeNull()
        ->and($item->was_bought)->toBeTrue()
        ->and($item->quantity_bought)->toBe(2)
        ->and((float) $item->total_price)->toBe(3000.0)
        ->and((float) $item->unit_price)->toBe(1500.0);
});

test('addProduct requires product_id, quantity_bought, unit_id_bought, place_id and total_price', function () {
    $user = User::factory()->create();
    Checklist::factory()->open()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post('/despensy/checkout/products', [])
        ->assertSessionHasErrors(['product_id', 'quantity_bought', 'unit_id_bought', 'place_id', 'total_price']);
});
