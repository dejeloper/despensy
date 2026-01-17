<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\PlaceRequest;
use App\Models\business\Place;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function index(Request $request)
    {
        $query = Place::query();

        // Ordenamiento
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Obtener todos los lugares para búsqueda/paginación en el cliente
        $allPlaces = $query->get();

        // Crear estructura compatible con paginación
        $places = [
            'data' => $allPlaces,
            'links' => [], // Se generarán en el cliente
            'current_page' => 1,
            'per_page' => $allPlaces->count(),
            'total' => $allPlaces->count(),
        ];

        return Inertia::render('places/index', [
            'places' => $places,
        ]);
    }

    public function create()
    {
        return Inertia::render('places/create');
    }

    public function store(PlaceRequest $request)
    {
        Place::create($request->validated());

        return redirect()
            ->route('places.index')
            ->with('success', 'Lugar creado exitosamente.');
    }

    public function edit(Place $place)
    {
        return Inertia::render('places/edit', [
            'place' => $place,
        ]);
    }

    public function update(PlaceRequest $request, Place $place)
    {
        $place->update($request->validated());

        return redirect()
            ->route('places.index')
            ->with('success', 'Lugar actualizado exitosamente.');
    }

    public function destroy(Place $place)
    {
        try {
            $place->delete();

            return redirect()
                ->route('places.index')
                ->with('success', 'Lugar eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->route('places.index')
                ->with('error', 'No se pudo eliminar el lugar. Puede estar en uso.');
        }
    }
}
