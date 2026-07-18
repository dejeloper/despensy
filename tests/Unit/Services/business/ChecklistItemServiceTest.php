<?php

use App\Exceptions\ChecklistNotEditableException;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Services\business\ChecklistItemService;

describe('ChecklistItemService', function () {
    test('markAsBought fills purchase data and computes total_price', function () {
        $checklist = Checklist::factory()->open()->create();
        $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);
        $place = Place::factory()->create();
        $unit = Unit::factory()->create();

        (new ChecklistItemService)->markAsBought($item, [
            'quantity_bought' => 2,
            'unit_id_bought' => $unit->id,
            'place_id' => $place->id,
            'unit_price' => 4500,
        ]);

        $item->refresh();

        expect($item->was_bought)->toBeTrue()
            ->and($item->quantity_bought)->toBe(2)
            ->and($item->place_id)->toBe($place->id)
            ->and((float) $item->unit_price)->toBe(4500.0)
            ->and((float) $item->total_price)->toBe(9000.0)
            ->and($item->purchase_date)->not->toBeNull();
    });

    test('markAsBought throws when the checklist is closed', function () {
        $checklist = Checklist::factory()->closed()->create();
        $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

        expect(fn () => (new ChecklistItemService)->markAsBought($item, [
            'quantity_bought' => 1,
            'unit_id_bought' => Unit::factory()->create()->id,
            'place_id' => Place::factory()->create()->id,
            'unit_price' => 1000,
        ]))->toThrow(ChecklistNotEditableException::class);
    });

    test('syncProduct creates an item when will_buy is true', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();
        $unit = Unit::factory()->create();

        $item = (new ChecklistItemService)->syncProduct($checklist, $product, [
            'will_buy' => true,
            'quantity_planned' => 2,
            'unit_id_planned' => $unit->id,
            'quantity_at_home' => 1,
            'unit_id_at_home' => $unit->id,
        ]);

        expect($item)->not->toBeNull()
            ->and($item->checklist_id)->toBe($checklist->id)
            ->and($item->product_id)->toBe($product->id)
            ->and($item->quantity_planned)->toBe(2)
            ->and($item->quantity_at_home)->toBe(1);
    });

    test('syncProduct updates the existing item instead of duplicating it', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();
        $unit = Unit::factory()->create();
        $service = new ChecklistItemService;

        $first = $service->syncProduct($checklist, $product, ['will_buy' => true, 'quantity_planned' => 1]);
        $second = $service->syncProduct($checklist, $product, ['will_buy' => true, 'quantity_planned' => 5, 'unit_id_planned' => $unit->id]);

        expect($second->id)->toBe($first->id)
            ->and($second->quantity_planned)->toBe(5)
            ->and(ChecklistItem::where('checklist_id', $checklist->id)->where('product_id', $product->id)->count())->toBe(1);
    });

    test('syncProduct removes the item when will_buy is false', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();
        $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id, 'product_id' => $product->id]);

        $result = (new ChecklistItemService)->syncProduct($checklist, $product, ['will_buy' => false]);

        expect($result)->toBeNull()
            ->and(ChecklistItem::find($item->id))->toBeNull();
    });

    test('syncProduct persists nothing when will_buy is false and there is no existing item', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();

        $result = (new ChecklistItemService)->syncProduct($checklist, $product, [
            'will_buy' => false,
            'quantity_at_home' => 3,
        ]);

        expect($result)->toBeNull()
            ->and(ChecklistItem::where('checklist_id', $checklist->id)->where('product_id', $product->id)->exists())->toBeFalse();
    });

    test('syncProduct throws when the checklist is closed', function () {
        $checklist = Checklist::factory()->closed()->create();
        $product = Product::factory()->create();

        expect(fn () => (new ChecklistItemService)->syncProduct($checklist, $product, ['will_buy' => true]))
            ->toThrow(ChecklistNotEditableException::class);
    });

    test('addPurchasedProduct creates the item already marked as bought', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();
        $place = Place::factory()->create();
        $unit = Unit::factory()->create();

        $item = (new ChecklistItemService)->addPurchasedProduct($checklist, $product, [
            'quantity_bought' => 3,
            'unit_id_bought' => $unit->id,
            'place_id' => $place->id,
            'unit_price' => 2000,
        ]);

        expect($item->checklist_id)->toBe($checklist->id)
            ->and($item->product_id)->toBe($product->id)
            ->and($item->was_bought)->toBeTrue()
            ->and($item->quantity_bought)->toBe(3)
            ->and($item->place_id)->toBe($place->id)
            ->and((float) $item->total_price)->toBe(6000.0);
    });

    test('addPurchasedProduct updates the existing item instead of duplicating it', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();
        $place = Place::factory()->create();
        $unit = Unit::factory()->create();
        $service = new ChecklistItemService;

        $planned = $service->syncProduct($checklist, $product, ['will_buy' => true, 'quantity_planned' => 1]);
        $bought = $service->addPurchasedProduct($checklist, $product, [
            'quantity_bought' => 2,
            'unit_id_bought' => $unit->id,
            'place_id' => $place->id,
            'unit_price' => 1500,
        ]);

        expect($bought->id)->toBe($planned->id)
            ->and($bought->was_bought)->toBeTrue()
            ->and(ChecklistItem::where('checklist_id', $checklist->id)->where('product_id', $product->id)->count())->toBe(1);
    });

    test('addPurchasedProduct throws when the checklist is closed', function () {
        $checklist = Checklist::factory()->closed()->create();
        $product = Product::factory()->create();

        expect(fn () => (new ChecklistItemService)->addPurchasedProduct($checklist, $product, [
            'quantity_bought' => 1,
            'unit_id_bought' => Unit::factory()->create()->id,
            'place_id' => Place::factory()->create()->id,
            'unit_price' => 1000,
        ]))->toThrow(ChecklistNotEditableException::class);
    });

    test('markAsNotBought clears the purchase data', function () {
        $checklist = Checklist::factory()->open()->create();
        $item = ChecklistItem::factory()->bought()->create(['checklist_id' => $checklist->id]);

        (new ChecklistItemService)->markAsNotBought($item);
        $item->refresh();

        expect($item->was_bought)->toBeFalse()
            ->and($item->quantity_bought)->toBeNull()
            ->and($item->unit_price)->toBeNull()
            ->and($item->total_price)->toBeNull()
            ->and($item->purchase_date)->toBeNull();
    });
});
