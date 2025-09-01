<?php

namespace App\Models\business;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
	use HasFactory;
	protected $fillable = [
		'name',
		'short_name',
		'address',
		'bg_color',
		'text_color',
		'note',
		'enabled'
	];
}
