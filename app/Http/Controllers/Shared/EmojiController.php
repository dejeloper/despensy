<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class EmojiController extends Controller
{
	protected $baseUrl;
	protected $accessKey;

	public function __construct()
	{
		$this->baseUrl = config('services.emoji.url');
		$this->accessKey = config('services.emoji.key');
	}

	public function index(Request $request)
	{
		$search = strtolower($request->query('search', ''));

		$allEmojis = Cache::remember('all_emojis', now()->addHour(), function () {
			$url = "{$this->baseUrl}/emojis?access_key={$this->accessKey}";
			$res = Http::get($url);
			return $res->ok() ? $res->json() : [];
		});

		if ($search) {
			$filtered = collect($allEmojis)->filter(function ($emoji) use ($search) {
				return str_contains(strtolower($emoji['unicodeName']), $search)
					|| str_contains(strtolower($emoji['slug']), $search);
			})->values()->all();

			return response()->json($filtered);
		}

		return response()->json($allEmojis);
	}

	public function categories()
	{
		$url = "{$this->baseUrl}/categories?access_key={$this->accessKey}";

		$data = Cache::remember('emoji_categories', now()->addHours(1), function () use ($url) {
			$res = Http::get($url);
			return $res->ok() ? $res->json() : [];
		});

		return response()->json($data);
	}

	public function byCategory($slug)
	{
		$url = "{$this->baseUrl}/categories/{$slug}?access_key={$this->accessKey}";

		$data = Cache::remember("emojis_category_{$slug}", now()->addMinutes(30), function () use ($url) {
			$res = Http::get($url);
			return $res->ok() ? $res->json() : [];
		});

		return response()->json($data);
	}
}
