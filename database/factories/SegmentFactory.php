<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Route;
use App\Models\Segment;
use App\Models\Stop;

class SegmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Segment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'from_stop_id' => Stop::factory(),
            'to_stop_id' => Stop::factory(),
            'distance' => $this->faker->randomFloat(0, 0, 9999999999.),
            'geoJson' => '{}',
            'meta' => '{}',
            'route_id' => Route::factory(),
        ];
    }
}
