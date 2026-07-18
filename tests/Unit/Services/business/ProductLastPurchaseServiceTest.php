<?php

use App\Models\business\Category;
use App\Models\business\Checklist;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Services\business\ChecklistItemService;
use App\Services\business\ProductLastPurchaseService;
use Illuminate\Support\Facades\DB;

function createChecklist(): int
{
    return DB::table('checklists')->insertGetId([
        'user_id' => \App\Models\User::factory()->create()->id,
        'state_id' => DB::table('states')->insertGetId([
            'name' => 'Abierta',
            'type' => 'CHECKLIST',
            'enabled' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

function createChecklistItem(int $checklistId, Product $product, Place $place, Unit $unit, float $price, string $createdAt): void
{
    DB::table('checklist_items')->insert([
        'checklist_id' => $checklistId,
        'product_id' => $product->id,
        'was_bought' => true,
        'place_id' => $place->id,
        'unit_id_bought' => $unit->id,
        'unit_price' => $price,
        'total_price' => $price,
        'purchase_date' => $createdAt,
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);
}

describe('ProductLastPurchaseService', function () {
    test('a product never purchased has null last purchase data', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();

        $result = (new ProductLastPurchaseService)->allWithLastPurchase();

        $entry = $result->firstWhere('id', $product->id);

        expect($entry->last_price)->toBeNull()
            ->and($entry->last_place_name)->toBeNull()
            ->and($entry->last_unit_name)->toBeNull()
            ->and($entry->last_purchase_date)->toBeNull();
    });

    test('a product with one purchase shows its price, place, unit and date', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $place = Place::factory()->create(['name' => 'D1']);
        $unit = Unit::factory()->create(['name' => 'Kilogramo', 'short_name' => 'kg']);

        $checklistId = createChecklist();
        createChecklistItem($checklistId, $product, $place, $unit, 4500, '2026-01-10 10:00:00');

        $result = (new ProductLastPurchaseService)->allWithLastPurchase();
        $entry = $result->firstWhere('id', $product->id);

        expect((float) $entry->last_price)->toBe(4500.0)
            ->and($entry->last_place_name)->toBe('D1')
            ->and($entry->last_unit_name)->toBe('Kilogramo');
    });

    test('a product with multiple purchases does not duplicate rows and keeps only the most recent one', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $oldPlace = Place::factory()->create(['name' => 'Alkosto']);
        $newPlace = Place::factory()->create(['name' => 'D1']);
        $unit = Unit::factory()->create();

        $checklistId = createChecklist();
        createChecklistItem($checklistId, $product, $oldPlace, $unit, 3000, '2026-01-01 10:00:00');
        createChecklistItem($checklistId, $product, $newPlace, $unit, 3500, '2026-01-15 10:00:00');

        $result = (new ProductLastPurchaseService)->allWithLastPurchase();
        $matches = $result->where('id', $product->id);

        expect($matches)->toHaveCount(1);

        $entry = $matches->first();

        expect((float) $entry->last_price)->toBe(3500.0)
            ->and($entry->last_place_name)->toBe('D1');
    });

    test('annotates a product with its item on the given active checklist', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $otherProduct = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $unit = Unit::factory()->create();
        $checklist = Checklist::factory()->open()->create();

        (new ChecklistItemService)->syncProduct($checklist, $product, [
            'will_buy' => true,
            'quantity_planned' => 3,
            'unit_id_planned' => $unit->id,
            'quantity_at_home' => 1,
            'unit_id_at_home' => $unit->id,
        ]);

        $result = (new ProductLastPurchaseService)->allWithLastPurchase($checklist->id);

        $entry = $result->firstWhere('id', $product->id);
        $otherEntry = $result->firstWhere('id', $otherProduct->id);

        expect($entry->active_checklist_item_id)->not->toBeNull()
            ->and($entry->active_quantity_planned)->toBe(3)
            ->and($entry->active_quantity_at_home)->toBe(1)
            ->and($otherEntry->active_checklist_item_id)->toBeNull();
    });

    test('annotates a product with its purchase data once marked as bought on the active checklist', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $unit = Unit::factory()->create();
        $place = Place::factory()->create();
        $checklist = Checklist::factory()->open()->create();
        $itemService = new ChecklistItemService;

        $item = $itemService->syncProduct($checklist, $product, ['will_buy' => true, 'quantity_planned' => 2]);
        $itemService->markAsBought($item, [
            'quantity_bought' => 2,
            'unit_id_bought' => $unit->id,
            'place_id' => $place->id,
            'total_price' => 6400,
        ]);

        $result = (new ProductLastPurchaseService)->allWithLastPurchase($checklist->id);
        $entry = $result->firstWhere('id', $product->id);

        expect($entry->active_was_bought)->toBeTruthy()
            ->and($entry->active_quantity_bought)->toBe(2)
            ->and($entry->active_unit_id_bought)->toBe($unit->id)
            ->and($entry->active_place_id)->toBe($place->id)
            ->and((float) $entry->active_unit_price)->toBe(3200.0);
    });

    test('purchaseHistoryFor returns only bought items for that product, most recent first', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $otherProduct = Product::factory()->withRelationships(Category::factory()->create()->id)->create();
        $place = Place::factory()->create();
        $unit = Unit::factory()->create();

        $checklistId = createChecklist();
        createChecklistItem($checklistId, $product, $place, $unit, 3000, '2026-01-01 10:00:00');
        createChecklistItem($checklistId, $product, $place, $unit, 3500, '2026-01-15 10:00:00');
        createChecklistItem($checklistId, $otherProduct, $place, $unit, 1000, '2026-01-20 10:00:00');
        DB::table('checklist_items')->insert([
            'checklist_id' => $checklistId,
            'product_id' => $product->id,
            'was_bought' => false,
            'quantity_planned' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $history = (new ProductLastPurchaseService)->purchaseHistoryFor($product);

        expect($history)->toHaveCount(2)
            ->and((float) $history->first()->unit_price)->toBe(3500.0)
            ->and((float) $history->last()->unit_price)->toBe(3000.0);
    });

    test('purchaseHistoryFor returns an empty collection for a product never purchased', function () {
        $product = Product::factory()->withRelationships(Category::factory()->create()->id)->create();

        expect((new ProductLastPurchaseService)->purchaseHistoryFor($product))->toHaveCount(0);
    });
});
