<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Journey;
use App\Models\Location;
use App\Models\User;

class JourneyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Journey::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'from_id' => Location::factory(),
            'destination_id' => Location::factory(),
            'expected_start_time' => $this->faker->dateTime(),
            'expected_end_time' => $this->faker->dateTime(),
            'start_time' => $this->faker->dateTime(),
            'end_time' => $this->faker->dateTime(),
            'meta' => '{}',
            'user_id' => User::factory(),
        ];
    }
}
