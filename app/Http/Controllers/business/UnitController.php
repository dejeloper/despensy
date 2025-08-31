<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\UnitRequest;
use App\Models\business\Unit;
use Inertia\Inertia;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $units = Unit::query()->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('units/index', [
            'units' => $units
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('units/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UnitRequest $request)
    {
        $validated = $request->validated();

        $unit = new Unit();
        $unit->name = $validated['name'];
        $unit->short_name = $validated['short_name'];
        $unit->enabled = true;
        $unit->save();

        return redirect()->route('units.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $unit = Unit::findOrFail($id);
        return Inertia::render('units/edit', ['unit' => $unit]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UnitRequest $request, string $id)
    {
        $unit = Unit::findOrFail($id);

        $validated = $request->validated();

        $unit->update($validated);

        return redirect()->route('units.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unit = Unit::findOrFail($id);
        $unit->delete();

        return redirect()->route('units.index');
    }
}
