<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChecklistItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => $this->whenLoaded('product', fn () => (new ProductResource($this->product))->resolve($request)),
            'quantity_planned' => $this->quantity_planned,
            'unit_planned' => $this->whenLoaded('unitPlanned', fn () => $this->unitPlanned ? (new UnitResource($this->unitPlanned))->resolve($request) : null),
            'was_bought' => $this->was_bought,
            'quantity_bought' => $this->quantity_bought,
            'unit_bought' => $this->whenLoaded('unitBought', fn () => $this->unitBought ? (new UnitResource($this->unitBought))->resolve($request) : null),
            'place' => $this->whenLoaded('place', fn () => $this->place ? (new PlaceResource($this->place))->resolve($request) : null),
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'purchase_date' => $this->purchase_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
