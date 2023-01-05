<?php

namespace App\Http\Services;

use App\Models\Journey;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;

class JourneyService
{
    public function storeJourney($from, $destination): Journey
    {
        $fromLocation = $this->storeLocation($from);
        $destinationLocation = $this->storeLocation($destination);
        $journey = Journey::create([
            'from_id' => $fromLocation->id,
            'destination_id' => $destinationLocation->id,
            'expected_start_time' => now(),
            'user_id' => Auth::id(),
        ]);

        return $journey;
    }


    // * Helper methods

    protected function storeLocation($locationDetails): Location
    {
        return Location::create([
            'name' => $locationDetails['name'],
            'lng' => $locationDetails['coordinates'][0],
            'lat' => $locationDetails['coordinates'][1],
        ]);
    }
}
