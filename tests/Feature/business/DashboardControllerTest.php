<?php

use App\Models\business\Category;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\User;

beforeEach(function () {
    seedChecklistStates();
});

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('dashboard shows no active checklist and empty rankings when there is no data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard')->assertOk();

    expect($response->inertiaProps('activeChecklist'))->toBeNull()
        ->and($response->inertiaProps('topCategories'))->toBe([])
        ->and($response->inertiaProps('topPlaces'))->toBe([])
        ->and($response->inertiaProps('topProducts'))->toBe([]);
});

test('dashboard shows the open checklist summary regardless of who created it', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $owner->id, 'name' => 'Mercado de la semana']);
    ChecklistItem::factory()->count(2)->create(['checklist_id' => $checklist->id]);

    $response = $this->actingAs($viewer)->get('/dashboard')->assertOk();

    $activeChecklist = $response->inertiaProps('activeChecklist');

    expect($activeChecklist['id'])->toBe($checklist->id)
        ->and($activeChecklist['name'])->toBe('Mercado de la semana')
        ->and($activeChecklist['itemsCount'])->toBe(2);
});

test('dashboard ranks categories, places and products by number of purchases', function () {
    $user = User::factory()->create();
    $checklist = Checklist::factory()->open()->create(['user_id' => $user->id]);

    $topCategory = Category::factory()->create();
    $otherCategory = Category::factory()->create();
    $topPlace = Place::factory()->create();
    $otherPlace = Place::factory()->create();
    $topProduct = Product::factory()->withRelationships($topCategory->id)->create();
    $otherProduct = Product::factory()->withRelationships($otherCategory->id)->create();

    // The top product/category/place get bought twice, the "other" ones once.
    ChecklistItem::factory()->count(2)->bought()->create([
        'checklist_id' => $checklist->id,
        'product_id' => $topProduct->id,
        'place_id' => $topPlace->id,
    ]);
    ChecklistItem::factory()->bought()->create([
        'checklist_id' => $checklist->id,
        'product_id' => $otherProduct->id,
        'place_id' => $otherPlace->id,
    ]);

    $response = $this->actingAs($user)->get('/dashboard')->assertOk();

    $topCategories = $response->inertiaProps('topCategories');
    $topPlaces = $response->inertiaProps('topPlaces');
    $topProducts = $response->inertiaProps('topProducts');

    expect($topCategories[0]['category']['id'])->toBe($topCategory->id)
        ->and($topCategories[0]['purchases_count'])->toBe(2)
        ->and($topPlaces[0]['place']['id'])->toBe($topPlace->id)
        ->and($topPlaces[0]['purchases_count'])->toBe(2)
        ->and($topProducts[0]['product']['id'])->toBe($topProduct->id)
        ->and($topProducts[0]['purchases_count'])->toBe(2);
});
