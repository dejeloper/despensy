<?php

use App\Models\User;

describe('User Model', function () {
	test('can create user with factory', function () {
		$user = User::factory()->create();

		expect($user)->toBeInstanceOf(User::class)
			->and($user->name)->toBeString()
			->and($user->email)->toBeString()
			->and($user->email)->toContain('@');
	});

	test('has correct fillable attributes', function () {
		$user = new User();
		$expected = ['name', 'email', 'password'];

		expect($user->getFillable())->toBe($expected);
	});

	test('has correct hidden attributes', function () {
		$user = new User();
		$expected = ['password', 'remember_token'];

		expect($user->getHidden())->toBe($expected);
	});

	test('password is hashed when set', function () {
		$user = User::factory()->create([
			'password' => 'plain-password'
		]);

		expect($user->password)->not()->toBe('plain-password')
			->and(strlen($user->password))->toBeGreaterThan(10);
	});

	test('email must be unique', function () {
		$email = 'test@example.com';

		User::factory()->create(['email' => $email]);

		expect(fn() => User::factory()->create(['email' => $email]))
			->toThrow(\Illuminate\Database\QueryException::class);
	});

	test('can make user with specific attributes', function () {
		$userData = [
			'name' => 'John Doe',
			'email' => 'john@example.com',
			'password' => 'password123'
		];

		$user = User::factory()->create($userData);

		expect($user->name)->toBe('John Doe')
			->and($user->email)->toBe('john@example.com');
	});
});
