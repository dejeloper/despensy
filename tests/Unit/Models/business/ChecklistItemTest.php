<?php

use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\Unit;

describe('ChecklistItem Model', function () {
    test('can create checklist item with factory', function () {
        $item = ChecklistItem::factory()->create();

        expect($item)->toBeInstanceOf(ChecklistItem::class)
            ->and($item->checklist_id)->toBeInt()
            ->and($item->product_id)->toBeInt()
            ->and($item->was_bought)->toBeFalse();
    });

    test('has correct fillable attributes', function () {
        $item = new ChecklistItem;
        $expected = [
            'checklist_id',
            'product_id',
            'quantity_planned',
            'unit_id_planned',
            'quantity_at_home',
            'unit_id_at_home',
            'was_bought',
            'quantity_bought',
            'unit_id_bought',
            'place_id',
            'unit_price',
            'total_price',
            'purchase_date',
        ];

        expect($item->getFillable())->toBe($expected);
    });

    test('bought state fills purchase data', function () {
        $item = ChecklistItem::factory()->bought()->create();

        expect($item->was_bought)->toBeTrue()
            ->and($item->quantity_bought)->not->toBeNull()
            ->and((float) $item->unit_price)->toBeGreaterThan(0)
            ->and($item->purchase_date)->not->toBeNull();
    });

    test('belongs to a checklist', function () {
        $checklist = Checklist::factory()->create();
        $item = ChecklistItem::factory()->create(['checklist_id' => $checklist->id]);

        expect($item->checklist)->toBeInstanceOf(Checklist::class)
            ->and($item->checklist->id)->toBe($checklist->id);
    });

    test('belongs to a product', function () {
        $product = Product::factory()->create();
        $item = ChecklistItem::factory()->create(['product_id' => $product->id]);

        expect($item->product)->toBeInstanceOf(Product::class)
            ->and($item->product->id)->toBe($product->id);
    });

    test('unitPlanned and unitBought can point to different units', function () {
        $planned = Unit::factory()->create();
        $bought = Unit::factory()->create();

        $item = ChecklistItem::factory()->create([
            'unit_id_planned' => $planned->id,
            'unit_id_bought' => $bought->id,
        ]);

        expect($item->unitPlanned->id)->toBe($planned->id)
            ->and($item->unitBought->id)->toBe($bought->id)
            ->and($item->unitPlanned->id)->not->toBe($item->unitBought->id);
    });

    test('belongs to a place', function () {
        $place = Place::factory()->create();
        $item = ChecklistItem::factory()->create(['place_id' => $place->id]);

        expect($item->place)->toBeInstanceOf(Place::class)
            ->and($item->place->id)->toBe($place->id);
    });

    test('scopeBought filters only bought items', function () {
        ChecklistItem::factory()->bought()->create();
        ChecklistItem::factory()->create();

        expect(ChecklistItem::bought()->get())->toHaveCount(1);
    });

    test('uses correct table name', function () {
        $item = new ChecklistItem;

        expect($item->getTable())->toBe('checklist_items');
    });
});
