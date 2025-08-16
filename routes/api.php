<?php

use App\Http\Controllers\Shared\EmojiController;
use Illuminate\Support\Facades\Route;

Route::get('/emojis', [EmojiController::class, 'index']);
Route::get('/emojis/categories', [EmojiController::class, 'categories']);
Route::get('/emojis/categories/{slug}', [EmojiController::class, 'byCategory']);
