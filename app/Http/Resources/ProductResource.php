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
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => (new CategoryResource($this->category))->resolve($request)),
            // Derivados de la última compra (ChecklistItem), presentes solo cuando
            // el producto viene de ProductLastPurchaseService::allWithLastPurchase().
            'last_price' => $this->last_price,
            'last_place_name' => $this->last_place_name,
            'last_place_bg_color' => $this->last_place_bg_color,
            'last_place_text_color' => $this->last_place_text_color,
            'last_unit_name' => $this->last_unit_name,
            'last_purchase_date' => $this->last_purchase_date,
            // Estado en la checklist activa, presentes solo cuando el producto viene
            // de ProductLastPurchaseService::allWithLastPurchase($activeChecklistId).
            'active_checklist_item_id' => $this->active_checklist_item_id,
            'active_quantity_planned' => $this->active_quantity_planned,
            'active_unit_id_planned' => $this->active_unit_id_planned,
            'active_quantity_at_home' => $this->active_quantity_at_home,
            'active_unit_id_at_home' => $this->active_unit_id_at_home,
            'active_was_bought' => is_null($this->active_was_bought) ? null : (bool) $this->active_was_bought,
            'active_quantity_bought' => $this->active_quantity_bought,
            'active_unit_id_bought' => $this->active_unit_id_bought,
            'active_place_id' => $this->active_place_id,
            'active_unit_price' => $this->active_unit_price,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
