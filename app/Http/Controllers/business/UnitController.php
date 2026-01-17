<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\UnitRequest;
use App\Models\business\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $query = Unit::query();

        // Ordenamiento
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Obtener todas las unidades para búsqueda/paginación en el cliente
        $allUnits = $query->get();

        // Crear estructura compatible con paginación
        $units = [
            'data' => $allUnits,
            'links' => [], // Se generarán en el cliente
            'current_page' => 1,
            'per_page' => $allUnits->count(),
            'total' => $allUnits->count(),
        ];

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
        Unit::create($request->validated());

        return redirect()
            ->route('units.index')
            ->with('success', 'Unidad creada exitosamente.');
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('units/edit', [
            'unit' => $unit,
        ]);
    }

    public function update(UnitRequest $request, Unit $unit)
    {
        $unit->update($request->validated());

        return redirect()
            ->route('units.index')
            ->with('success', 'Unidad actualizada exitosamente.');
    }

    public function destroy(Unit $unit)
    {
        try {
            $unit->delete();

            return redirect()
                ->route('units.index')
                ->with('success', 'Unidad eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->route('units.index')
                ->with('error', 'No se pudo eliminar la unidad. Puede estar en uso.');
        }
    }
}
