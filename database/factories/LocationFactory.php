<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Location;
use App\Models\User;

class LocationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Location::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'lng' => $this->faker->longitude,
            'lat' => $this->faker->latitude,
            'landmark' => $this->faker->word,
            'address' => '{}',
            'meta' => '{}',
            'user_id' => User::factory(),
        ];
    }
}
