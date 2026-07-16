<?php

namespace App\Http\Controllers\business;

use App\Exceptions\ChecklistNotEditableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\business\ChecklistItemMarkBoughtRequest;
use App\Http\Requests\business\ChecklistItemRequest;
use App\Models\business\Checklist;
use App\Models\business\ChecklistItem;
use App\Services\business\ChecklistItemService;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function __construct(private ChecklistItemService $itemService) {}

    public function store(ChecklistItemRequest $request, Checklist $checklist)
    {
        abort_unless($checklist->user_id === $request->user()->id, 403);

        try {
            $this->itemService->addProduct($checklist, $request->validated());
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto agregado a la lista.');
    }

    public function destroy(Request $request, Checklist $checklist, ChecklistItem $item)
    {
        abort_unless($checklist->user_id === $request->user()->id, 403);
        abort_unless($item->checklist_id === $checklist->id, 404);

        try {
            $this->itemService->removeProduct($item);
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto quitado de la lista.');
    }

    public function markBought(ChecklistItemMarkBoughtRequest $request, ChecklistItem $item)
    {
        abort_unless($item->checklist->user_id === $request->user()->id, 403);

        try {
            $this->itemService->markAsBought($item, $request->validated());
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto marcado como comprado.');
    }

    public function markNotBought(Request $request, ChecklistItem $item)
    {
        abort_unless($item->checklist->user_id === $request->user()->id, 403);

        try {
            $this->itemService->markAsNotBought($item);
        } catch (ChecklistNotEditableException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Producto marcado como no comprado.');
    }
}
