<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlaceRequest extends FormRequest
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
		$placeId = $this->route('place') ? $this->route('place')->id : null;

		return [
			'name' => [
				'required',
				'string',
				'max:50',
				Rule::unique('places', 'name')->ignore($placeId)
			],
			'short_name' => [
				'required',
				'string',
				'max:30',
				Rule::unique('places', 'short_name')->ignore($placeId)
			],
			'address' => 'nullable|string|max:100',
			'bg_color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
			'text_color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
			'note' => 'nullable|string|max:200',
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
			'name.unique' => 'El nombre ya está en uso.',
			'short_name.required' => 'El nombre corto es obligatorio.',
			'short_name.unique' => 'El nombre corto ya está en uso.',
			'short_name.string' => 'El nombre corto debe ser una cadena de texto.',
			'short_name.max' => 'El nombre corto no puede tener más de 30 caracteres.',
			'address.string' => 'La dirección debe ser una cadena de texto.',
			'address.max' => 'La dirección no puede tener más de 100 caracteres.',
			'bg_color.required' => 'El color de fondo es obligatorio.',
			'bg_color.size' => 'El color de fondo debe tener 7 caracteres.',
			'bg_color.regex' => 'El color de fondo debe ser un color hexadecimal válido (#RRGGBB).',
			'text_color.required' => 'El color del texto es obligatorio.',
			'text_color.size' => 'El color del texto debe tener 7 caracteres.',
			'text_color.regex' => 'El color del texto debe ser un color hexadecimal válido (#RRGGBB).',
			'note.string' => 'La nota debe ser una cadena de texto.',
			'note.max' => 'La nota no puede tener más de 200 caracteres.',
			'enabled.required' => 'El estado es obligatorio.',
			'enabled.boolean' => 'El estado debe ser verdadero o falso.',
		];
	}
}
