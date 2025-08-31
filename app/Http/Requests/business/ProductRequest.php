<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest  extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 */
	public function rules(): array
	{
		return [
			'name' => 'required|string|max:50|min:3',
			'description' => 'required|string|max:255|min:5',
			'image' => 'string|min:5',
			'category_id' => 'required|exists:categories,id',
			'place_id' => 'required|exists:places,id',
			'unit_id' => 'required|exists:units,id',
			'enabled' => 'required|boolean',
		];
	}

	/**
	 * Get custom messages for validator errors.
	 */
	public function messages(): array
	{
		return [
			'name.required' => 'El nombre es obligatorio.',
			'name.string' => 'El nombre debe ser una cadena de texto.',
			'name.max' => 'El nombre no puede tener más de 50 caracteres.',
			'name.min' => 'El nombre debe tener al menos 3 caracteres.',
			'description.string' => 'La descripción debe ser una cadena de texto.',
			'description.max' => 'La descripción no puede tener más de 255 caracteres.',
			'description.min' => 'La descripción debe tener al menos 5 caracteres.',
			'image.min' => 'La imagen debe tener al menos 5 caracteres.',
			'image.string' => 'La imagen debe ser una cadena de texto.',
			'category_id.required' => 'La categoría es obligatoria.',
			'place_id.required' => 'El lugar es obligatorio.',
			'unit_id.required' => 'La unidad es obligatoria.',
			'enabled.required' => 'El estado es obligatorio.',
			'enabled.boolean' => 'El estado debe ser verdadero o falso.',
		];
	}
}
