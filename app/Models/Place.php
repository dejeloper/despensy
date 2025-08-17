<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
	protected $fillable = [
		'name',
		'slug',
		'address',
		'bg_color',
		'text_color',
		'note',
		'enabled'
	];
}
