<?php

namespace App\Http\Controllers;

use App\Charts\MonthlyJourneysChart;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Journey;
use App\Models\Feedback;
use Illuminate\Http\Request;
use App\Charts\MonthlyUsersChart;

class DashboardController extends Controller
{
    function dashboard(
        Request $request,
        MonthlyUsersChart $usersChartBuilder,
        MonthlyJourneysChart $journeysChartBuilder
    ) {
        try {
            $usersChart = $usersChartBuilder->build()->getData();
            $journeysChart = $journeysChartBuilder->build()->getData();

            $journeyCount = Journey::count();
            $userCount = User::count();
            $feedbackCount = 0; // fallback (table might not be there)
            $feedbackCount = Feedback::count();
        } catch (\Throwable $th) {
            //throw $th;
        }

        return Inertia::render(
            'Dashboard',
            compact('journeyCount', 'feedbackCount', 'userCount', 'usersChart', 'journeysChart')
        );
    }
}
