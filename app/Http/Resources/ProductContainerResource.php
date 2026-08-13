<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductContainerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->whenLoaded('product', fn() => $this->product->name),
            'place_id' => $this->place_id,
            'place_name' => $this->whenLoaded('place', fn() => $this->place?->name),
            'container_unit_id' => $this->container_unit_id,
            'container_unit_name' => $this->whenLoaded('containerUnit', fn() => $this->containerUnit->name),
            'content_quantity' => $this->content_quantity,
            'content_unit_id' => $this->content_unit_id,
            'content_unit_name' => $this->whenLoaded('contentUnit', fn() => $this->contentUnit->name),
        ];
    }
}
