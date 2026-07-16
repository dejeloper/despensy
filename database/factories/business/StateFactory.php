<?php

namespace Database\Factories\business;

use App\Models\business\State;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\business\State>
 */
class StateFactory extends Factory
{
    protected $model = State::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                State::CHECKLIST_OPEN,
                State::CHECKLIST_IN_PROGRESS,
                State::CHECKLIST_CLOSED,
                State::CHECKLIST_CANCELLED,
            ]),
            'type' => State::TYPE_CHECKLIST,
            'color' => $this->faker->hexColor(),
            'icon' => null,
            'enabled' => true,
        ];
    }

    /**
     * Create the "Abierta" (open) checklist state.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => State::CHECKLIST_OPEN,
            'type' => State::TYPE_CHECKLIST,
        ]);
    }

    /**
     * Create the "En Progreso" (in progress) checklist state.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => State::CHECKLIST_IN_PROGRESS,
            'type' => State::TYPE_CHECKLIST,
        ]);
    }

    /**
     * Create the "Cerrada" (closed) checklist state.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => State::CHECKLIST_CLOSED,
            'type' => State::TYPE_CHECKLIST,
        ]);
    }

    /**
     * Create the "Cancelada" (cancelled) checklist state.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => State::CHECKLIST_CANCELLED,
            'type' => State::TYPE_CHECKLIST,
        ]);
    }
}
