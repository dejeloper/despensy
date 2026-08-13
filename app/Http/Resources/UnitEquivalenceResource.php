<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitEquivalenceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'unit_id' => $this->unit_id,
            'unit_name' => $this->whenLoaded('unit', fn() => $this->unit->name),
            'parent_unit_id' => $this->parent_unit_id,
            'parent_unit_name' => $this->whenLoaded('parent', fn() => $this->parent->name),
            'factor' => $this->factor,
        ];
    }
}
