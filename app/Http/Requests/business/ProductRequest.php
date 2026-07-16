<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
		$productId = $this->route('product') ? $this->route('product')->id : null;

		return [
			'name' => [
				'required',
				'string',
				'max:100',
				'min:3',
				Rule::unique('products', 'name')->ignore($productId)
			],
			'description' => 'nullable|string|max:500',
			'image' => 'nullable|string|min:5',
			'category_id' => 'required|exists:categories,id',
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
			'name.max' => 'El nombre no puede tener más de 100 caracteres.',
			'name.min' => 'El nombre debe tener al menos 3 caracteres.',
			'name.unique' => 'El nombre ya existe.',
			'description.string' => 'La descripción debe ser una cadena de texto.',
			'description.max' => 'La descripción no puede tener más de 500 caracteres.',
			'image.min' => 'La imagen debe tener al menos 5 caracteres.',
			'image.string' => 'La imagen debe ser una cadena de texto.',
			'category_id.required' => 'La categoría es obligatoria.',
			'category_id.exists' => 'La categoría seleccionada no existe.',
			'enabled.required' => 'El estado es obligatorio.',
			'enabled.boolean' => 'El estado debe ser verdadero o falso.',
		];
	}
}
