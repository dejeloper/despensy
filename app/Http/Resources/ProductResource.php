<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'name' => $this->name,
			'description' => $this->description,
			'image' => $this->image,
			'enabled' => $this->enabled,
			'category' => new CategoryResource($this->whenLoaded('category')),
			// Derivados de la última compra (ChecklistItem), presentes solo cuando
			// el producto viene de ProductLastPurchaseService::allWithLastPurchase().
			'last_price' => $this->last_price,
			'last_place_id' => $this->last_place_id,
			'last_place_name' => $this->last_place_name,
			'last_unit_id' => $this->last_unit_id,
			'last_unit_name' => $this->last_unit_name,
			'last_purchase_date' => $this->last_purchase_date,
			'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
			'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
		];
	}
}
