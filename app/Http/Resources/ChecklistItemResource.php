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
            'product' => new ProductResource($this->whenLoaded('product')),
            'quantity_planned' => $this->quantity_planned,
            'unit_planned' => new UnitResource($this->whenLoaded('unitPlanned')),
            'was_bought' => $this->was_bought,
            'quantity_bought' => $this->quantity_bought,
            'unit_bought' => new UnitResource($this->whenLoaded('unitBought')),
            'place' => new PlaceResource($this->whenLoaded('place')),
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'purchase_date' => $this->purchase_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
