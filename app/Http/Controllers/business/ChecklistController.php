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
        return Inertia::render('checklists/index', [
            'checklists' => $checklists,
        ]);
    }

    public function create(Request $request)
    {
        $query = Product::with(['category', 'unit', 'place'])
            ->where('enabled', true);

        // Aplicar filtro de búsqueda
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Aplicar filtro de categoría
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        $products = $query->get();

        return Inertia::render('checklists/create', [
            'products' => $products,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
        ]);

        $service = new \App\Services\ChecklistService();
        $service->createChecklist($request->user(), $request->items);

        return redirect()->route('checklists.index');
    }

    public function edit(Request $request, $id)
    {
        $checklist = Checklist::with('details.product.category')->findOrFail($id);

        $query = Product::with(['category', 'unit', 'place'])
            ->where('enabled', true);

        // Aplicar filtro de búsqueda
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Aplicar filtro de categoría
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        $products = $query->get();

        return Inertia::render('checklists/edit', [
            'checklist' => $checklist,
            'products' => $products,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
        ]);

        $checklist = Checklist::findOrFail($id);

        // Eliminar items anteriores
        $checklist->details()->delete();

        // Crear nuevos items
        $service = new \App\Services\ChecklistService();
        foreach ($request->items as $item) {
            $checklist->details()->create([
                'product_id' => $item['product_id'],
                'reported_stock' => $item['reported_stock'],
                'quantity_planned' => $item['quantity_planned'],
            ]);
        }

        return redirect()->route('checklists.index');
    }

    public function show($id)
    {
        $checklist = Checklist::with('details.product')->findOrFail($id);
        $places = Place::all();

        return Inertia::render('checklists/show', [
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
