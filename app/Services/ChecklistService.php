<?php

namespace App\Services;

use App\Models\business\Checklist;
use App\Models\business\ChecklistDetail;
use App\Models\business\PurchaseHistory;
use App\Models\business\Product;
use Illuminate\Support\Facades\DB;

class ChecklistService
{
    public function createChecklist($user, $items)
    {
        return DB::transaction(function () use ($user, $items) {
            $checklist = Checklist::create([
                'user_id' => $user->id ?? 1,
                'status' => 'ACTIVE',
            ]);

            foreach ($items as $item) {
                ChecklistDetail::create([
                    'checklist_id' => $checklist->id,
                    'product_id' => $item['product_id'],
                    'reported_stock' => $item['reported_stock'] ?? null,
                    'to_buy' => $item['to_buy'] ?? false,
                    'quantity_planned' => $item['quantity_planned'] ?? null,
                ]);
            }

            return $checklist->load('details.product');
        });
    }

    public function processItem($checklistId, $itemId, $data, $user)
    {
        return DB::transaction(function () use ($checklistId, $itemId, $data, $user) {
            $detail = ChecklistDetail::where('checklist_id', $checklistId)
                ->where('id', $itemId)
                ->firstOrFail();

            $product = $detail->product;
            $oldStock = $product->stock;

            $detail->update([
                'quantity_bought' => $data['quantity_bought'],
                'price_paid' => $data['price_paid'],
                'place_id' => $data['place_id'],
                'is_processed' => true,
            ]);

            $newStock = $oldStock + $data['quantity_bought'];
            $product->update([
                'stock' => $newStock,
                'price' => $data['price_paid'],
            ]);

            PurchaseHistory::create([
                'product_id' => $product->id,
                'user_id' => $user->id ?? 1,
                'checklist_id' => $checklistId,
                'place_id' => $data['place_id'],
                'quantity' => $data['quantity_bought'],
                'price' => $data['price_paid'],
                'old_stock' => $oldStock,
                'new_stock' => $newStock,
                'date' => now(),
            ]);

            $this->checkCompletion($checklistId);

            return $detail;
        });
    }

    private function checkCompletion($checklistId)
    {
        $checklist = Checklist::find($checklistId);
        $pendingItems = $checklist->details()->where('to_buy', true)->where('is_processed', false)->count();

        if ($pendingItems === 0) {
            $checklist->update(['status' => 'COMPLETED']);
        }
    }

    public function getActiveChecklist()
    {
        return Checklist::where('status', 'ACTIVE')->with('details.product')->latest()->first();
    }
}
