<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Route;
use App\Models\Stop;

class StopFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Stop::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'is_interchange' => $this->faker->boolean,
            'is_terminal' => $this->faker->boolean,
            'meta' => '{}',
            'previous_stop_id' => Stop::factory(),
            'next_stop_id' => Stop::factory(),
            'route_id' => Route::factory(),
        ];
    }
}
