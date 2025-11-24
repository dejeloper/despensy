<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Models\business\Checklist;
use App\Models\business\Product;
use App\Models\business\Place;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChecklistController extends Controller
{
    public function index()
    {
        $checklists = Checklist::with('details')->paginate(10);
        return Inertia::render('checklists.index', [
            'checklists' => $checklists,
        ]);
    }

    public function create()
    {
        $products = Product::where('enabled', true)->get();
        return Inertia::render('checklists.create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.to_buy' => 'boolean',
        ]);

        $service = new \App\Services\ChecklistService();
        $service->createChecklist($request->user(), $request->items);

        return redirect()->route('checklists.index');
    }

    public function show($id)
    {
        $checklist = Checklist::with('details.product')->findOrFail($id);
        $places = Place::all();

        return Inertia::render('checklists.index', [
            'checklist' => $checklist,
            'places' => $places,
        ]);
    }

    public function updateItem(Request $request, $checklistId, $itemId)
    {
        $request->validate([
            'quantity_bought' => 'required|integer|min:0',
            'price_paid' => 'required|numeric|min:0',
            'place_id' => 'required|exists:places,id',
        ]);

        $service = new \App\Services\ChecklistService();
        $service->processItem($checklistId, $itemId, $request->all(), $request->user());

        return redirect()->back();
    }

    public function destroy($id)
    {
        $checklist = Checklist::findOrFail($id);
        $checklist->delete();

        return redirect()->route('checklists.index');
    }
}
