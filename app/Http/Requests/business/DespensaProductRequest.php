<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;

class DespensaProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'will_buy' => 'required|boolean',
            'quantity_planned' => 'nullable|integer|min:1',
            'unit_id_planned' => 'nullable|exists:units,id',
            'quantity_at_home' => 'nullable|integer|min:1',
            'unit_id_at_home' => 'nullable|exists:units,id',
        ];
    }

    public function messages(): array
    {
        return [
            'will_buy.required' => 'Debes indicar si se va a comprar.',
            'will_buy.boolean' => 'El valor de "se va a comprar" no es válido.',
            'quantity_planned.integer' => 'La cantidad a comprar debe ser un número entero.',
            'quantity_planned.min' => 'La cantidad a comprar debe ser al menos 1.',
            'unit_id_planned.exists' => 'La unidad seleccionada no existe.',
            'quantity_at_home.integer' => 'La cantidad en casa debe ser un número entero.',
            'quantity_at_home.min' => 'La cantidad en casa debe ser al menos 1.',
            'unit_id_at_home.exists' => 'La unidad seleccionada no existe.',
        ];
    }
}
