<?php

use App\Exceptions\ChecklistNotEditableException;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;
use App\Services\business\ChecklistItemService;

describe('ChecklistItemService', function () {
    test('addProduct creates an item with the planned quantity and unit', function () {
        $checklist = Checklist::factory()->open()->create();
        $product = Product::factory()->create();
        $unit = Unit::factory()->create();

        $item = (new ChecklistItemService)->addProduct($checklist, [
            'product_id' => $product->id,
            'quantity_planned' => 3,
            'unit_id_planned' => $unit->id,
        ]);

        expect($item->checklist_id)->toBe($checklist->id)
            ->and($item->product_id)->toBe($product->id)
            ->and($item->quantity_planned)->toBe(3)
            ->and($item->unit_id_planned)->toBe($unit->id)
            ->and($item->was_bought)->toBeFalse();
    });

    test('addProduct throws when the checklist is closed', function () {
        $checklist = Checklist::factory()->closed()->create();
        $product = Product::factory()->create();

        expect(fn () => (new ChecklistItemService)->addProduct($checklist, ['product_id' => $product->id]))
            ->toThrow(ChecklistNotEditableException::class);
    });

    test('removeProduct deletes the item', function () {
        $checklist = Checklist::factory()->open()->create();
        $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

        (new ChecklistItemService)->removeProduct($item);

        expect(ChecklistItem::find($item->id))->toBeNull();
    });

    test('removeProduct throws when the checklist is cancelled', function () {
        $checklist = Checklist::factory()->cancelled()->create();
        $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

        expect(fn () => (new ChecklistItemService)->removeProduct($item))
            ->toThrow(ChecklistNotEditableException::class);
    });

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
