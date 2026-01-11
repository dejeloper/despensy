<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
		$categoryId = $this->route('category') ? $this->route('category')->id : null;

		return [
			'name' => [
				'required',
				'string',
				'max:50',
				'min:3',
				Rule::unique('categories', 'name')->ignore($categoryId)
			],
			'icon' => 'required|string',
			'bg_color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
			'text_color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
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
			'name.min' => 'El nombre debe tener al menos 3 caracteres.',
			'name.max' => 'El nombre no puede tener más de 50 caracteres.',
			'name.unique' => 'El nombre ya existe.',
			'icon.required' => 'El icono es obligatorio.',
			'icon.string' => 'El icono debe ser una cadena de texto.',
			'bg_color.required' => 'El color de fondo es obligatorio.',
			'bg_color.size' => 'El color de fondo debe tener 7 caracteres.',
			'bg_color.regex' => 'El color de fondo debe ser un color hexadecimal válido (#RRGGBB).',
			'text_color.required' => 'El color del texto es obligatorio.',
			'text_color.size' => 'El color del texto debe tener 7 caracteres.',
			'text_color.regex' => 'El color del texto debe ser un color hexadecimal válido (#RRGGBB).',
			'enabled.required' => 'El estado es obligatorio.',
			'enabled.boolean' => 'El estado debe ser verdadero o falso.',
		];
	}
}
