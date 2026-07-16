<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'quantity_planned' => 'nullable|integer|min:1',
            'unit_id_planned' => 'nullable|exists:units,id',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'quantity_planned.integer' => 'La cantidad debe ser un número entero.',
            'quantity_planned.min' => 'La cantidad debe ser al menos 1.',
            'unit_id_planned.exists' => 'La unidad seleccionada no existe.',
        ];
    }
}
