<?php

namespace App\Services\business;

use App\Exceptions\ChecklistNotEditableException;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Models\business\Product;
use App\Models\business\State;

class ChecklistItemService
{
    /**
     * Mark a checklist item as bought, recording what was actually purchased.
     *
     * @throws ChecklistNotEditableException if the checklist is closed or cancelled.
     */
    public function markAsBought(ChecklistItem $item, array $data): ChecklistItem
    {
        $this->guardEditable($item->checklist);

        $quantity = $data['quantity_bought'];
        $unitPrice = $data['unit_price'];

        $item->update([
            'was_bought' => true,
            'quantity_bought' => $quantity,
            'unit_id_bought' => $data['unit_id_bought'],
            'place_id' => $data['place_id'],
            'unit_price' => $unitPrice,
            'total_price' => $unitPrice * $quantity,
            'purchase_date' => $data['purchase_date'] ?? now()->toDateString(),
        ]);

        return $item;
    }

    /**
     * Undo a "bought" mark, clearing the purchase data back to planned-only.
     *
     * @throws ChecklistNotEditableException if the checklist is closed or cancelled.
     */
    public function markAsNotBought(ChecklistItem $item): ChecklistItem
    {
        $this->guardEditable($item->checklist);

        $item->update([
            'was_bought' => false,
            'quantity_bought' => null,
            'unit_id_bought' => null,
            'place_id' => null,
            'unit_price' => null,
            'total_price' => null,
            'purchase_date' => null,
        ]);

        return $item;
    }

    /**
     * Sync a product's planned state on the checklist from the Despensa
     * view: upserts the item when the user wants to buy it (updating it in
     * place if it was already there, instead of duplicating it), or removes
     * it when they don't. If `will_buy` is false, nothing gets persisted —
     * "hay en la casa" without "se va a comprar" is not saved anywhere.
     *
     * @throws ChecklistNotEditableException if the checklist is closed or cancelled.
     */
    public function syncProduct(Checklist $checklist, Product $product, array $data): ?ChecklistItem
    {
        $this->guardEditable($checklist);

        $item = $checklist->items()->where('product_id', $product->id)->first();

        if (! $data['will_buy']) {
            $item?->delete();

            return null;
        }

        $attributes = [
            'quantity_planned' => $data['quantity_planned'] ?? null,
            'unit_id_planned' => $data['unit_id_planned'] ?? null,
            'quantity_at_home' => $data['quantity_at_home'] ?? null,
            'unit_id_at_home' => $data['unit_id_at_home'] ?? null,
        ];

        if ($item) {
            $item->update($attributes);

            return $item;
        }

        return $checklist->items()->create($attributes + [
            'product_id' => $product->id,
            'was_bought' => false,
        ]);
    }

    /**
     * Add a product straight into the checklist already marked as bought —
     * used by the checkout flow, where "add" and "buy" happen in the same
     * action. Upserts like syncProduct(): if the product already has an item
     * on this checklist (e.g. it was planned), it's updated in place instead
     * of creating a duplicate.
     *
     * @throws ChecklistNotEditableException if the checklist is closed or cancelled.
     */
    public function addPurchasedProduct(Checklist $checklist, Product $product, array $purchaseData): ChecklistItem
    {
        $this->guardEditable($checklist);

        $quantity = $purchaseData['quantity_bought'];
        $unitPrice = $purchaseData['unit_price'];

        $attributes = [
            'quantity_planned' => $quantity,
            'unit_id_planned' => $purchaseData['unit_id_bought'],
            'was_bought' => true,
            'quantity_bought' => $quantity,
            'unit_id_bought' => $purchaseData['unit_id_bought'],
            'place_id' => $purchaseData['place_id'],
            'unit_price' => $unitPrice,
            'total_price' => $unitPrice * $quantity,
            'purchase_date' => $purchaseData['purchase_date'] ?? now()->toDateString(),
        ];

        $item = $checklist->items()->where('product_id', $product->id)->first();

        if ($item) {
            $item->update($attributes);

            return $item;
        }

        return $checklist->items()->create($attributes + ['product_id' => $product->id]);
    }

    private function guardEditable(Checklist $checklist): void
    {
        $stateName = $checklist->state->name;

        if (in_array($stateName, [State::CHECKLIST_CLOSED, State::CHECKLIST_CANCELLED], true)) {
            throw ChecklistNotEditableException::forState($stateName);
        }
    }
}
