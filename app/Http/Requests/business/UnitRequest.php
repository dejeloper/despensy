<?php

namespace App\Http\Requests\business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
     */
    public function rules(): array
    {
        $unitId = $this->route('unit') ? $this->route('unit')->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('units', 'name')->ignore($unitId)
            ],
            'short_name' => [
                'required',
                'string',
                'max:10',
                Rule::unique('units', 'short_name')->ignore($unitId)
            ],
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
            'name.unique' => 'El nombre ya está en uso.',
            'short_name.required' => 'El nombre corto es obligatorio.',
            'short_name.string' => 'El nombre corto debe ser texto.',
            'short_name.max' => 'El nombre corto no puede tener más de 10 caracteres.',
            'short_name.unique' => 'El nombre corto ya está en uso.',
            'enabled.required' => 'El estado es obligatorio.',
            'enabled.boolean' => 'El estado debe ser verdadero o falso.'
        ];
    }
}
