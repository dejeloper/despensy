<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\UnitEquivalenceRequest;
use App\Models\business\UnitEquivalence;

class UnitEquivalenceController extends Controller
{
    public function store(UnitEquivalenceRequest $request)
    {
        UnitEquivalence::create($request->validated());

        return back()->with('success', 'Equivalencia creada exitosamente.');
    }

    public function update(UnitEquivalenceRequest $request, UnitEquivalence $unitEquivalence)
    {
        $unitEquivalence->update($request->validated());

        return back()->with('success', 'Equivalencia actualizada exitosamente.');
    }

    public function destroy(UnitEquivalence $unitEquivalence)
    {
        $unitEquivalence->delete();

        return back()->with('success', 'Equivalencia eliminada exitosamente.');
    }
}
