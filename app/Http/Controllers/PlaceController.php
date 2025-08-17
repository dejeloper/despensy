<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceRequest;
use App\Models\Place;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaceController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$places = Place::query()->orderBy('name')
			->paginate(10)
			->withQueryString();

		return Inertia::render('places/index', [
			'places' => $places
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return Inertia::render('places/create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(PlaceRequest $request)
	{
		$validated = $request->validated();

		$place = new Place();
		$place->name = $validated['name'];
		$place->slug = $validated['slug'];
		$place->address = $validated['address'] ?? null;
		$place->bg_color = $validated['bg_color'];
		$place->text_color = $validated['text_color'];
		$place->note = $validated['note'] ?? null;
		$place->enabled = true;
		$place->save();

		return redirect()->route('places.index');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		$place = Place::findOrFail($id);
		return Inertia::render('places/show', ['place' => $place]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(string $id)
	{
		$place = Place::findOrFail($id);
		return Inertia::render('places/edit', ['place' => $place]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(PlaceRequest $request, string $id)
	{
		$place = Place::findOrFail($id);

		$validated = $request->validated();

		$place->update($validated);

		return redirect()->route('places.index');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		$place = Place::findOrFail($id);
		$place->delete();

		return redirect()->route('places.index');
	}
}
