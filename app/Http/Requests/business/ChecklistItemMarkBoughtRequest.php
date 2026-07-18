<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistItemMarkBoughtRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantity_bought' => 'required|integer|min:1',
            'unit_id_bought' => 'required|exists:units,id',
            'place_id' => 'required|exists:places,id',
            'total_price' => 'required|numeric|min:0',
            'purchase_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'quantity_bought.required' => 'La cantidad comprada es obligatoria.',
            'quantity_bought.integer' => 'La cantidad debe ser un número entero.',
            'quantity_bought.min' => 'La cantidad debe ser al menos 1.',
            'unit_id_bought.required' => 'La unidad es obligatoria.',
            'unit_id_bought.exists' => 'La unidad seleccionada no existe.',
            'place_id.required' => 'El lugar es obligatorio.',
            'place_id.exists' => 'El lugar seleccionado no existe.',
            'total_price.required' => 'El precio total es obligatorio.',
            'total_price.numeric' => 'El precio total debe ser un número.',
            'total_price.min' => 'El precio total debe ser mayor o igual a 0.',
            'purchase_date.date' => 'La fecha no es válida.',
        ];
    }
}
