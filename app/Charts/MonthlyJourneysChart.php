<?php

namespace App\Charts;

use App\Models\Journey;
use Flowframe\Trend\Trend;
use Illuminate\Http\JsonResponse;
use ArielMejiaDev\LarapexCharts\LarapexChart;

class MonthlyJourneysChart
{
    protected $chart;

    public function __construct(LarapexChart $chart)
    {
        $this->chart = $chart;
    }

    public function build(): JsonResponse
    {
        $trend = Trend::model(Journey::class)
            ->between(
                start: now()->endOfMonth()->subYear(),
                end: now()->endOfMonth(),
            )
            ->perMonth()
            ->count();

        return $this->chart->lineChart()
            ->setTitle('Journeys')
            ->addLine('Journey', $trend->map(fn ($value) => $value->aggregate)->toArray())
            ->setXAxis($trend->map(fn ($value) => $value->date)->toArray())
            ->setColors(['#ffc63b'])
            ->toJson();
    }
}
