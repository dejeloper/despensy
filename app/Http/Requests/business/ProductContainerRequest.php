<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductContainerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'place_id' => $this->input('place_id') ?: null,
        ]);
    }

    public function rules(): array
    {
        $containerId = $this->route('product_container')?->id;
        $placeId = $this->input('place_id');

        $unique = Rule::unique('product_containers', 'container_unit_id')
            ->where('product_id', $this->integer('product_id'))
            ->ignore($containerId);

        $placeId === null ? $unique->whereNull('place_id') : $unique->where('place_id', $placeId);

        return [
            'product_id' => 'required|exists:products,id',
            'place_id' => 'nullable|exists:places,id',
            'container_unit_id' => [
                'required',
                'exists:units,id',
                'different:content_unit_id',
                $unique,
            ],
            'content_quantity' => 'required|numeric|min:0.0001',
            'content_unit_id' => 'required|exists:units,id',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es obligatorio.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'place_id.exists' => 'El lugar seleccionado no existe.',
            'container_unit_id.required' => 'El contenedor es obligatorio.',
            'container_unit_id.exists' => 'El contenedor seleccionado no existe.',
            'container_unit_id.different' => 'El contenedor y su contenido deben ser unidades distintas.',
            'container_unit_id.unique' => 'Ya hay una regla para ese producto, lugar y contenedor.',
            'content_quantity.required' => 'La cantidad que contiene es obligatoria.',
            'content_quantity.numeric' => 'La cantidad debe ser un número.',
            'content_quantity.min' => 'La cantidad debe ser mayor que 0.',
            'content_unit_id.required' => 'La unidad del contenido es obligatoria.',
            'content_unit_id.exists' => 'La unidad seleccionada no existe.',
        ];
    }
}
