<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class JourneyController extends Controller
{
    public function welcome(Request $request)
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'mapAccessToken' => config("mapbox.accessToken")
        ]);
    }

    public function journey(Request $request)
    {
        return Inertia::render('RouteMap', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'mapAccessToken' => config("mapbox.accessToken")
        ]);
    }
}
