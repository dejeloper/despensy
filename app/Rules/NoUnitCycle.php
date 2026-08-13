<?php

namespace App\Rules;

use App\Models\business\UnitEquivalence;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoUnitCycle implements ValidationRule
{
    private const MAX_DEPTH = 10;

    public function __construct(private readonly ?int $unitId) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->unitId === null || $value === null) {
            return;
        }

        if ((int) $value === $this->unitId) {
            $fail('Una unidad no puede equivaler a sí misma.');

            return;
        }

        $currentUnitId = (int) $value;

        for ($depth = 0; $depth < self::MAX_DEPTH; $depth++) {
            $equivalence = UnitEquivalence::where('unit_id', $currentUnitId)->first();

            if ($equivalence === null) {
                return;
            }

            if ($equivalence->parent_unit_id === $this->unitId) {
                $fail('Esa unidad ya se expresa en esta, se formaría un ciclo.');

                return;
            }

            $currentUnitId = $equivalence->parent_unit_id;
        }

        $fail('La cadena de equivalencias es demasiado larga.');
    }
}
