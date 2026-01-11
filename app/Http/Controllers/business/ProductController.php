<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\ProductRequest;
use App\Models\business\Product;
use App\Models\business\Category;
use App\Models\business\Place;
use App\Models\business\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'place', 'unit']);

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtro por categoría
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filtro por lugar
        if ($request->filled('place_id')) {
            $query->where('place_id', $request->place_id);
        }

        // Filtro por unidad
        if ($request->filled('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }

        // Filtro por estado
        if ($request->filled('enabled')) {
            $query->where('enabled', $request->enabled);
        }

        // Filtro por stock bajo (productos con stock menor o igual a un valor)
        if ($request->filled('low_stock')) {
            $query->where('stock', '<=', $request->low_stock);
        }

        // Ordenamiento
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $products = $query->paginate($request->get('per_page', 10))
            ->withQueryString();

        // Obtener datos para los filtros
        $categories = Category::where('enabled', true)->get(['id', 'name']);
        $places = Place::where('enabled', true)->get(['id', 'name']);
        $units = Unit::where('enabled', true)->get(['id', 'name', 'short_name']);

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
            'filters' => $request->only([
                'search',
                'category_id',
                'place_id',
                'unit_id',
                'enabled',
                'low_stock',
                'sort',
                'direction',
                'per_page'
            ]),
        ]);
    }

    public function create()
    {
        $categories = Category::where('enabled', true)->get(['id', 'name', 'icon', 'bg_color', 'text_color']);
        $places = Place::where('enabled', true)->get(['id', 'name', 'bg_color', 'text_color']);
        $units = Unit::where('enabled', true)->get(['id', 'name', 'short_name']);

        return Inertia::render('products/create', [
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
        ]);
    }

    public function store(ProductRequest $request)
    {
        Product::create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('enabled', true)->get(['id', 'name', 'icon', 'bg_color', 'text_color']);
        $places = Place::where('enabled', true)->get(['id', 'name', 'bg_color', 'text_color']);
        $units = Unit::where('enabled', true)->get(['id', 'name', 'short_name']);

        return Inertia::render('products/edit', [
            'product' => $product->load(['category', 'place', 'unit']),
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return redirect()
                ->route('products.index')
                ->with('success', 'Producto eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->route('products.index')
                ->with('error', 'No se pudo eliminar el producto. Puede estar en uso.');
        }
    }

    /**
     * Actualizar solo el precio y stock de un producto
     */
    public function updatePrice(Request $request, Product $product)
    {
        $validated = $request->validate([
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return back()->with('success', 'Precio y stock actualizados exitosamente.');
    }
}
