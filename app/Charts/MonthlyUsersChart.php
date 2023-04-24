<?php

namespace App\Charts;

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
        return $this->chart->pieChart()
            ->setTitle('Users')
            ->addData([
                \App\Models\User::where('id', '<=', 20)->count(),
                \App\Models\User::where('id', '>', 20)->count()
            ])
            ->setColors(['#ffc63b', '#ff6384'])
            ->setLabels(['Active users', 'Inactive users'])
            ->toJson();
    }
}
