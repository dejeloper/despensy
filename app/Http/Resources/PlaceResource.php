<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
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
			'short_name' => $this->short_name,
			'address' => $this->address,
			'bg_color' => $this->bg_color,
			'text_color' => $this->text_color,
			'note' => $this->note,
			'enabled' => $this->enabled,
			'products_count' => $this->whenLoaded('products', function () {
				return $this->products->count();
			}),
			'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
			'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
		];
	}
}
