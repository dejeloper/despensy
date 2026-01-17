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
        $query = Product::with(['category', 'place', 'unit'])
            ->leftJoin('checklist_items as ci', function ($join) {
                $join->on('ci.product_id', '=', 'products.id')
                     ->where('ci.was_bought', true);
            })
            ->leftJoin('places as last_place', 'last_place.id', '=', 'ci.place_id')
            ->leftJoin('units as last_unit', 'last_unit.id', '=', 'ci.unit_id_bought')
            ->select([
                'products.*',
                'ci.unit_price as last_price',
                'last_place.name as last_place_name',
                'last_place.id as last_place_id',
                'last_unit.name as last_unit_name',
                'last_unit.id as last_unit_id'
            ])
            ->selectRaw('(
                SELECT MAX(created_at) 
                FROM checklist_items 
                WHERE product_id = products.id AND was_bought = true
            ) as last_purchase_date')
            ->orderByRaw('COALESCE((
                SELECT MAX(created_at) 
                FROM checklist_items 
                WHERE product_id = products.id AND was_bought = true
            ), products.created_at) DESC');

        // Obtener todos los productos para búsqueda/paginación en el cliente
        $allProducts = $query->get();

        // Crear estructura compatible con paginación
        $products = [
            'data' => $allProducts,
            'links' => [], // Se generarán en el cliente
            'current_page' => 1,
            'per_page' => $allProducts->count(),
            'total' => $allProducts->count(),
        ];

        // Obtener datos para los filtros
        $categories = Category::where('enabled', true)->get(['id', 'name']);
        $places = Place::where('enabled', true)->get(['id', 'name']);
        $units = Unit::where('enabled', true)->get(['id', 'name', 'short_name']);

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'places' => $places,
            'units' => $units,
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
