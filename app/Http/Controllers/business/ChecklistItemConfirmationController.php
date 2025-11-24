<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Models\business\ChecklistDetail;
use App\Models\business\ChecklistItemConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChecklistItemConfirmationController extends Controller
{
    /**
     * Store a new confirmation for a checklist item.
     */
    public function store(Request $request, $checklistId, $itemId)
    {
        $request->validate([
            'se_compro' => 'required|boolean',
            'place_final_id' => 'nullable|exists:places,id',
            'unit_final_id' => 'nullable|exists:units,id',
            'cantidad_comprada' => 'required|integer|min:0',
            'precio_unitario' => 'required|numeric|min:0',
            'fecha_compra' => 'nullable|date',
        ]);

        $item = ChecklistDetail::where('checklist_id', $checklistId)
            ->where('id', $itemId)
            ->firstOrFail();

        DB::transaction(function () use ($request, $item) {
            $confirmation = ChecklistItemConfirmation::create([
                'checklist_item_id' => $item->id,
                'se_compro' => $request->boolean('se_compro'),
                'place_final_id' => $request->input('place_final_id'),
                'unit_final_id' => $request->input('unit_final_id'),
                'cantidad_comprada' => $request->integer('cantidad_comprada'),
                'precio_unitario' => $request->float('precio_unitario'),
                'precio_total' => $request->float('precio_unitario') * $request->integer('cantidad_comprada'),
                'fecha_compra' => $request->input('fecha_compra'),
                'usuario_id' => Auth::id(),
            ]);

            // Mark the item as processed
            $item->update(['is_processed' => true]);

            // Recalculate checklist totals
            $checklist = $item->checklist;
            $totalEstimado = $checklist->details()->sum(DB::raw('quantity_planned * price')); // assuming price column exists in product
            $totalReal = $checklist->details()
                ->whereHas('confirmation')
                ->join('checklist_item_confirmations', 'checklist_details.id', '=', 'checklist_item_confirmations.checklist_item_id')
                ->sum('checklist_item_confirmations.precio_total');

            $checklist->update([
                'total_estimado' => $totalEstimado,
                'total_real' => $totalReal,
            ]);
        });

        return redirect()->back();
    }

    /**
     * Update an existing confirmation.
     */
    public function update(Request $request, $checklistId, $itemId)
    {
        $request->validate([
            'se_compro' => 'required|boolean',
            'place_final_id' => 'nullable|exists:places,id',
            'unit_final_id' => 'nullable|exists:units,id',
            'cantidad_comprada' => 'required|integer|min:0',
            'precio_unitario' => 'required|numeric|min:0',
            'fecha_compra' => 'nullable|date',
        ]);

        $confirmation = ChecklistItemConfirmation::whereHas('checklistItem', function ($q) use ($checklistId, $itemId) {
            $q->where('checklist_id', $checklistId)->where('id', $itemId);
        })->firstOrFail();

        DB::transaction(function () use ($request, $confirmation) {
            $confirmation->update([
                'se_compro' => $request->boolean('se_compro'),
                'place_final_id' => $request->input('place_final_id'),
                'unit_final_id' => $request->input('unit_final_id'),
                'cantidad_comprada' => $request->integer('cantidad_comprada'),
                'precio_unitario' => $request->float('precio_unitario'),
                'precio_total' => $request->float('precio_unitario') * $request->integer('cantidad_comprada'),
                'fecha_compra' => $request->input('fecha_compra'),
            ]);

            // Recalculate checklist totals
            $checklist = $confirmation->checklistItem->checklist;
            $totalReal = $checklist->details()
                ->whereHas('confirmation')
                ->join('checklist_item_confirmations', 'checklist_details.id', '=', 'checklist_item_confirmations.checklist_item_id')
                ->sum('checklist_item_confirmations.precio_total');

            $checklist->update(['total_real' => $totalReal]);
        });

        return redirect()->back();
    }

    /**
     * Mark an item as not bought (se_compro = false) without creating a full confirmation.
     */
    public function markNoBuy($checklistId, $itemId)
    {
        $item = ChecklistDetail::where('checklist_id', $checklistId)->where('id', $itemId)->firstOrFail();
        DB::transaction(function () use ($item) {
            // Ensure a confirmation exists with se_compro = false
            ChecklistItemConfirmation::updateOrCreate(
                ['checklist_item_id' => $item->id],
                ['se_compro' => false, 'precio_total' => 0]
            );
            $item->update(['is_processed' => true]);
        });
        return redirect()->back();
    }
}
