<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated users can register new users', function () {
    // Creamos un usuario existente
    $admin = User::factory()->create();

    // Lo logueamos
    $this->actingAs($admin);

    // Ahora sí registramos otro usuario
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    // Verificamos que el nuevo usuario existe
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
    ]);

    // El admin sigue autenticado (NO el nuevo user)
    $this->assertAuthenticatedAs($admin);

    $response->assertRedirect(route('dashboard', absolute: false));
});
