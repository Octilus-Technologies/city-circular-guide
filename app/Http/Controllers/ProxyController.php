<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProxyController extends Controller
{
    public function mapProxy($path, Request $request)
    {
        $invalidate = $request->has('invalidate');

        if ($invalidate) {
            Cache::forget($request->fullUrl());
        }

        return Cache::remember($request->fullUrl(), 60 * 24, function () use ($request, $path) {
            $response = $this->fetchMapData($path, $request);
            if ($response->getStatusCode() === 200) {
                return response($response->getBody())->withHeaders($response->getHeaders());
            }
        });
    }

    public function fetchMapData($path, Request $request)
    {
        $client = new \GuzzleHttp\Client();
        $api = "https://api.mapbox.com";
        $query = $request->getQueryString();
        $url = "{$api}/{$path}?{$query}";

        return $client->request($request->method(), $url);
    }
}
