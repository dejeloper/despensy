<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnitRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50',
            'enabled' => 'required|boolean'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser texto.',
            'name.max' => 'El nombre no puede tener más de 50 caracteres.',
            'short_name.required' => 'El nombre corto es obligatorio.',
            'short_name.string' => 'El nombre corto debe ser texto.',
            'short_name.max' => 'El nombre corto no puede tener más de 5 caracteres.',
            'enabled.required' => 'El estado es obligatorio.',
            'enabled.boolean' => 'El estado debe ser verdadero o falso.'
        ];
    }
}
