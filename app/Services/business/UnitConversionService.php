<?php

namespace App\Services\business;

use App\Models\business\ProductContainer;
use App\Models\business\Unit;
use App\Models\business\UnitEquivalence;
use Illuminate\Support\Collection;

class UnitConversionService
{

    private const MAX_DEPTH = 10;

    private ?Collection $units = null;

    private ?Collection $equivalences = null;

    private ?Collection $containers = null;

    public function purchaseBreakdown(float $quantity, Unit $unit, ?float $totalPrice, ?int $productId = null, ?int $placeId = null): ?array
    {
        if ($totalPrice === null || $quantity <= 0) {
            return null;
        }

        [$baseUnit, $factor] = $this->resolveChain($unit, $productId, $placeId) ?? [$unit, 1.0];
        $baseQuantity = $quantity * $factor;

        return [
            'unit_name' => $baseUnit->name,
            'unit_short_name' => $baseUnit->short_name,
            'unit_price' => $baseQuantity > 0 ? $totalPrice / $baseQuantity : null,
        ];
    }

    public function resolveChain(Unit $unit, ?int $productId = null, ?int $placeId = null): ?array
    {
        $current = $unit;
        $factor = 1.0;
        $steps = 0;

        for ($depth = 0; $depth < self::MAX_DEPTH; $depth++) {
            $step = $this->nextStep($current, $productId, $placeId);

            if ($step === null) {
                break;
            }

            [$nextUnitId, $stepFactor] = $step;
            $next = $this->allUnits()->get($nextUnitId);

            if ($next === null) {
                break;
            }

            $factor *= $stepFactor;
            $current = $next;
            $steps++;
        }

        return $steps === 0 ? null : [$current, $factor];
    }

    public function isUnconfigured(Unit $unit): bool
    {
        $inEquivalences = $this->allEquivalences()->contains(
            fn(UnitEquivalence $e) => $e->unit_id === $unit->id || $e->parent_unit_id === $unit->id
        );

        if ($inEquivalences) {
            return false;
        }

        return ! $this->allContainers()->contains(
            fn(ProductContainer $c) => $c->container_unit_id === $unit->id || $c->content_unit_id === $unit->id
        );
    }

    private function nextStep(Unit $unit, ?int $productId, ?int $placeId): ?array
    {
        $container = $this->containerFor($unit, $productId, $placeId);

        if ($container !== null) {
            return [$container->content_unit_id, $container->content_quantity];
        }

        $equivalence = $this->allEquivalences()->firstWhere('unit_id', $unit->id);

        return $equivalence === null ? null : [$equivalence->parent_unit_id, $equivalence->factor];
    }

    private function containerFor(Unit $unit, ?int $productId, ?int $placeId): ?ProductContainer
    {
        if ($productId === null) {
            return null;
        }

        $candidates = $this->allContainers()
            ->where('product_id', $productId)
            ->where('container_unit_id', $unit->id);

        return $candidates->firstWhere('place_id', $placeId)
            ?? $candidates->firstWhere('place_id', null);
    }

    private function allUnits(): Collection
    {
        return $this->units ??= Unit::all()->keyBy('id');
    }

    private function allEquivalences(): Collection
    {
        return $this->equivalences ??= UnitEquivalence::all();
    }

    private function allContainers(): Collection
    {
        return $this->containers ??= ProductContainer::all();
    }
}
