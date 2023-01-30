<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Journey;
use Illuminate\Http\Request;
use App\Http\Services\JourneyService;
use Illuminate\Support\Facades\Route;

class JourneyController extends Controller
{

    public function __construct(
        protected JourneyService $journeyService
    ) {
    }

    public function welcome(Request $request)
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'mapAccessToken' => config("mapbox.accessToken")
        ]);
    }

    public function startJourney(Request $request)
    {
        $from = $request->get('from');
        $destination = $request->get('destination');

        $journey = $this->journeyService->storeJourney($from, $destination);

        return response()->redirectTo(route('journey', $journey->getKey()));
    }

    public function journey(Journey $journey)
    {
        return Inertia::render('Journey', [
            'journey' => $journey,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'mapAccessToken' => config("mapbox.accessToken")
        ]);
    }
}
