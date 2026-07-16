<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no puede tener más de 100 caracteres.',
        ];
    }
}
