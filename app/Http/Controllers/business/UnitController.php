<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\UnitRequest;
use App\Models\business\Unit;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::paginate(10);
        return Inertia::render('units/index', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        return Inertia::render('units/create');
    }

    public function store(UnitRequest $request)
    {
        $request->validate([
            'name' => 'required|string',
            'short_name' => 'required|string',
            'enabled' => 'boolean',
        ]);

        Unit::create($request->all());

        return redirect()->route('units.index');
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('units/edit', [
            'unit' => $unit,
        ]);
    }

    public function update(UnitRequest $request, Unit $unit)
    {
        $request->validate([
            'name' => 'string',
            'short_name' => 'string',
            'enabled' => 'boolean',
        ]);

        $unit->update($request->all());

        return redirect()->route('units.index');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->route('units.index');
    }
}
