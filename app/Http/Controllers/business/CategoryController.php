<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\CategoryRequest;
use App\Models\business\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::paginate(10);
        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('categories/create');
    }

    public function store(CategoryRequest $request)
    {
        $request->validate([
            'name' => 'required|string',
            'icon' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'text_color' => 'nullable|string',
            'enabled' => 'boolean',
        ]);

        Category::create($request->all());

        return redirect()->route('categories.index');
    }

    public function edit(Category $category)
    {
        return Inertia::render('categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $request->validate([
            'name' => 'string',
            'icon' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'text_color' => 'nullable|string',
            'enabled' => 'boolean',
        ]);

        $category->update($request->all());

        return redirect()->route('categories.index');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index');
    }
}
