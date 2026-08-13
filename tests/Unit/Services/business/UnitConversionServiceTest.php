<?php

use App\Models\business\Place;
use App\Models\business\Product;
use App\Models\business\ProductContainer;
use App\Models\business\Unit;
use App\Models\business\UnitEquivalence;
use App\Services\business\UnitConversionService;

/**
 * El servicio cachea los catálogos en la primera consulta, así que cada test
 * crea sus datos **antes** de instanciarlo.
 */
function makeUnit(string $name, string $shortName): Unit
{
    return Unit::factory()->create(['name' => $name, 'short_name' => $shortName]);
}

function equivalence(Unit $unit, Unit $parent, float $factor): UnitEquivalence
{
    return UnitEquivalence::create([
        'unit_id' => $unit->id,
        'parent_unit_id' => $parent->id,
        'factor' => $factor,
    ]);
}

describe('UnitConversionService', function () {
    test('resolves a single dimensional step', function () {
        $gram = makeUnit('Gramo', 'g');
        $kilo = makeUnit('Kilogramo', 'Kg');
        equivalence($kilo, $gram, 1000);

        [$base, $factor] = (new UnitConversionService)->resolveChain($kilo);

        expect($base->id)->toBe($gram->id)
            ->and($factor)->toBe(1000.0);
    });

    test('walks the whole chain up to the root', function () {
        $gram = makeUnit('Gramo', 'g');
        $pound = makeUnit('Libra', 'Lb');
        $arroba = makeUnit('Arroba', 'Arb');
        equivalence($pound, $gram, 500);
        equivalence($arroba, $pound, 25);

        [$base, $factor] = (new UnitConversionService)->resolveChain($arroba);

        expect($base->id)->toBe($gram->id)
            ->and($factor)->toBe(12500.0);
    });

    test('resolveChain returns null for a unit without any rule', function () {
        $box = makeUnit('Caja', 'Cja');

        expect((new UnitConversionService)->resolveChain($box))->toBeNull();
    });

    test('purchaseBreakdown divides by the converted quantity', function () {
        $gram = makeUnit('Gramo', 'g');
        $kilo = makeUnit('Kilogramo', 'Kg');
        equivalence($kilo, $gram, 1000);

        $breakdown = (new UnitConversionService)->purchaseBreakdown(1.64, $kilo, 2453);

        expect($breakdown['unit_short_name'])->toBe('g')
            ->and(round($breakdown['unit_price'], 4))->toBe(1.4957);
    });

    test('a purchase already in the base unit still gets its unit price', function () {
        $gram = makeUnit('Gramo', 'g');
        $kilo = makeUnit('Kilogramo', 'Kg');
        equivalence($kilo, $gram, 1000);

        $breakdown = (new UnitConversionService)->purchaseBreakdown(600, $gram, 2975);

        expect($breakdown['unit_short_name'])->toBe('g')
            ->and(round($breakdown['unit_price'], 4))->toBe(4.9583);
    });

    test('purchaseBreakdown returns null without a price to divide', function () {
        $box = makeUnit('Caja', 'Cja');

        expect((new UnitConversionService)->purchaseBreakdown(2, $box, null))->toBeNull();
    });

    test('a product container beats the dimensional equivalence and keeps chaining', function () {
        $ml = makeUnit('Mililitro', 'ml');
        $unit = makeUnit('Unidad', 'Und');
        $package = makeUnit('Paquete', 'Paq');
        $milk = Product::factory()->create(['name' => 'Leche']);
        $marketA = Place::factory()->create(['name' => 'Mercado A']);

        ProductContainer::create([
            'product_id' => $milk->id,
            'place_id' => $marketA->id,
            'container_unit_id' => $package->id,
            'content_quantity' => 6,
            'content_unit_id' => $unit->id,
        ]);
        ProductContainer::create([
            'product_id' => $milk->id,
            'place_id' => null,
            'container_unit_id' => $unit->id,
            'content_quantity' => 1300,
            'content_unit_id' => $ml->id,
        ]);

        [$base, $factor] = (new UnitConversionService)->resolveChain($package, $milk->id, $marketA->id);

        expect($base->id)->toBe($ml->id)
            ->and($factor)->toBe(7800.0);
    });

    test('the same container resolves differently per place', function () {
        $unit = makeUnit('Unidad', 'Und');
        $package = makeUnit('Paquete', 'Paq');
        $milk = Product::factory()->create(['name' => 'Leche']);
        $marketA = Place::factory()->create(['name' => 'Mercado A']);
        $marketB = Place::factory()->create(['name' => 'Mercado B']);

        foreach ([[$marketA, 6], [$marketB, 8]] as [$place, $quantity]) {
            ProductContainer::create([
                'product_id' => $milk->id,
                'place_id' => $place->id,
                'container_unit_id' => $package->id,
                'content_quantity' => $quantity,
                'content_unit_id' => $unit->id,
            ]);
        }

        $service = new UnitConversionService;

        expect($service->resolveChain($package, $milk->id, $marketA->id)[1])->toBe(6.0)
            ->and($service->resolveChain($package, $milk->id, $marketB->id)[1])->toBe(8.0);
    });

    test('falls back to the row without place when the place has no rule of its own', function () {
        $unit = makeUnit('Unidad', 'Und');
        $package = makeUnit('Paquete', 'Paq');
        $milk = Product::factory()->create(['name' => 'Leche']);
        $otherPlace = Place::factory()->create(['name' => 'Mercado C']);

        ProductContainer::create([
            'product_id' => $milk->id,
            'place_id' => null,
            'container_unit_id' => $package->id,
            'content_quantity' => 4,
            'content_unit_id' => $unit->id,
        ]);

        expect((new UnitConversionService)->resolveChain($package, $milk->id, $otherPlace->id)[1])->toBe(4.0);
    });

    test('a container of one product does not leak into another', function () {
        $unit = makeUnit('Unidad', 'Und');
        $package = makeUnit('Paquete', 'Paq');
        $milk = Product::factory()->create(['name' => 'Leche']);
        $rice = Product::factory()->create(['name' => 'Arroz']);

        ProductContainer::create([
            'product_id' => $milk->id,
            'place_id' => null,
            'container_unit_id' => $package->id,
            'content_quantity' => 6,
            'content_unit_id' => $unit->id,
        ]);

        expect((new UnitConversionService)->resolveChain($package, $rice->id, null))->toBeNull();
    });

    test('isUnconfigured is false for a root unit but true for an isolated one', function () {
        $gram = makeUnit('Gramo', 'g');
        $kilo = makeUnit('Kilogramo', 'Kg');
        equivalence($kilo, $gram, 1000);
        $box = makeUnit('Caja', 'Cja');

        $service = new UnitConversionService;

        expect($service->isUnconfigured($gram))->toBeFalse()
            ->and($service->isUnconfigured($kilo))->toBeFalse()
            ->and($service->isUnconfigured($box))->toBeTrue();
    });

    test('a cyclic chain does not hang: the depth cap stops the walk', function () {
        $first = makeUnit('Uno', 'U1');
        $second = makeUnit('Dos', 'U2');
        equivalence($first, $second, 2);
        equivalence($second, $first, 2);

        expect((new UnitConversionService)->resolveChain($first)[1])->toBeFloat();
    });
});
