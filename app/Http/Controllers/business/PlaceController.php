<?php

namespace App\Http\Controllers\business;

use App\Http\Controllers\Controller;
use App\Http\Requests\business\PlaceRequest;
use App\Models\business\Place;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function index()
    {
        $places = Place::paginate(10);
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
        $request->validate([
            'name' => 'required|string',
            'icon' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'text_color' => 'nullable|string',
            'enabled' => 'boolean',
        ]);

        Place::create($request->all());

        return redirect()->route('places.index');
    }

    public function edit(Place $place)
    {
        return Inertia::render('places/edit', [
            'place' => $place,
        ]);
    }

    public function update(PlaceRequest $request, Place $place)
    {
        $request->validate([
            'name' => 'string',
            'icon' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'text_color' => 'nullable|string',
            'enabled' => 'boolean',
        ]);

        $place->update($request->all());

        return redirect()->route('places.index');
    }

    public function destroy(Place $place)
    {
        $place->delete();

        return redirect()->route('places.index');
    }
}
