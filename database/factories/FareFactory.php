<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Fare;
use App\Models\Route;
use App\Models\Segment;

class FareFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Fare::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'amount' => $this->faker->randomFloat(0, 0, 9999999999.),
            'meta' => '{}',
            'segment_id' => Segment::factory(),
            'route_id' => Route::factory(),
        ];
    }
}
