<?php

namespace Database\Factories\business;

use App\Models\business\Checklist;
use App\Models\business\State;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\Checklist>
 */
class ChecklistFactory extends Factory
{
    protected $model = Checklist::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->optional()->words(3, true),
            'state_id' => State::factory()->open(),
        ];
    }

    /**
     * Put the checklist in the "Abierta" (open) state.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'state_id' => State::factory()->open(),
        ]);
    }

    /**
     * Put the checklist in the "Cerrada" (closed) state.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'state_id' => State::factory()->closed(),
        ]);
    }

    /**
     * Put the checklist in the "Cancelada" (cancelled) state.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'state_id' => State::factory()->cancelled(),
        ]);
    }
}
