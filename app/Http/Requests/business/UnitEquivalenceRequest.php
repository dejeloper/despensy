<?php

namespace App\Http\Requests\business;

use App\Rules\NoUnitCycle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UnitEquivalenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $equivalenceId = $this->route('unit_equivalence')?->id;

        return [
            'unit_id' => [
                'required',
                'exists:units,id',
                Rule::unique('unit_equivalences', 'unit_id')->ignore($equivalenceId),
            ],
            'parent_unit_id' => [
                'required',
                'exists:units,id',
                'different:unit_id',
                new NoUnitCycle($this->integer('unit_id') ?: null),
            ],
            'factor' => 'required|numeric|min:0.0001',
        ];
    }

    public function messages(): array
    {
        return [
            'unit_id.required' => 'La unidad es obligatoria.',
            'unit_id.exists' => 'La unidad seleccionada no existe.',
            'unit_id.unique' => 'Esa unidad ya tiene una equivalencia registrada.',
            'parent_unit_id.required' => 'Debes indicar a qué unidad equivale.',
            'parent_unit_id.exists' => 'La unidad equivalente seleccionada no existe.',
            'parent_unit_id.different' => 'Una unidad no puede equivaler a sí misma.',
            'factor.required' => 'El factor es obligatorio.',
            'factor.numeric' => 'El factor debe ser un número.',
            'factor.min' => 'El factor debe ser mayor que 0.',
        ];
    }
}
