<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutAddProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'quantity_bought' => 'required|integer|min:1',
            'unit_id_bought' => 'required|exists:units,id',
            'place_id' => 'required|exists:places,id',
            'unit_price' => 'required|numeric|min:0',
            'purchase_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'quantity_bought.required' => 'La cantidad comprada es obligatoria.',
            'quantity_bought.integer' => 'La cantidad debe ser un número entero.',
            'quantity_bought.min' => 'La cantidad debe ser al menos 1.',
            'unit_id_bought.required' => 'La unidad es obligatoria.',
            'unit_id_bought.exists' => 'La unidad seleccionada no existe.',
            'place_id.required' => 'El lugar es obligatorio.',
            'place_id.exists' => 'El lugar seleccionado no existe.',
            'unit_price.required' => 'El precio es obligatorio.',
            'unit_price.numeric' => 'El precio debe ser un número.',
            'unit_price.min' => 'El precio debe ser mayor o igual a 0.',
            'purchase_date.date' => 'La fecha no es válida.',
        ];
    }
}
