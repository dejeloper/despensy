<?php

namespace App\Http\Controllers\business;

use App\Exceptions\ChecklistNotEditableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\business\ChecklistItemMarkBoughtRequest;
use App\Models\business\ChecklistItem;
use App\Services\business\ChecklistItemService;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function __construct(private ChecklistItemService $itemService) {}

    public function markBought(ChecklistItemMarkBoughtRequest $request, int $item)
    {
        $checklistItem = ChecklistItem::find($item);

        if (! $checklistItem) {
            return back()->with('error', 'Este producto ya no está en la lista. Recarga la página.');
        }

        abort_unless($checklistItem->checklist->user_id === $request->user()->id, 403);

        try {
            $this->itemService->markAsBought($checklistItem, $request->validated());
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto marcado como comprado.');
    }

    public function markNotBought(Request $request, int $item)
    {
        $checklistItem = ChecklistItem::find($item);

        if (! $checklistItem) {
            return back()->with('error', 'Este producto ya no está en la lista. Recarga la página.');
        }

        abort_unless($checklistItem->checklist->user_id === $request->user()->id, 403);

        try {
            $this->itemService->markAsNotBought($checklistItem);
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto marcado como no comprado.');
    }
}
