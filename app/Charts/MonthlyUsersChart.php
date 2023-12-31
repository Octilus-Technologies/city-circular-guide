<?php

namespace App\Charts;

use App\Models\User;
use Flowframe\Trend\Trend;
use Illuminate\Http\JsonResponse;
use ArielMejiaDev\LarapexCharts\LarapexChart;

class MonthlyUsersChart
{
    protected $chart;

    public function __construct(LarapexChart $chart)
    {
        $this->chart = $chart;
    }

    public function build(): JsonResponse
    {
        $trend = Trend::model(User::class)
            ->between(
                start: now()->endOfMonth()->subYear(),
                end: now()->endOfMonth(),
            )
            ->perMonth()
            ->count();

        return $this->chart->lineChart()
            ->setTitle('New Users')
            ->addLine('New users', $trend->map(fn ($value) => $value->aggregate)->toArray())
            ->setXAxis($trend->map(fn ($value) => $value->date)->toArray())
            ->setColors(['#4646b9'])
            ->toJson();
    }
}
