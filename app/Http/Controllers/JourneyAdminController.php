<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Journey;
use App\Http\Resources\JourneyResource;

class JourneyAdminController extends Controller
{
    public function index()
    {
        $journeyCollection = Journey::latest()->paginate(10);
        $journeys = JourneyResource::collection($journeyCollection);

        return Inertia::render('AdminJourneys/Index', compact('journeys'));
    }
}
