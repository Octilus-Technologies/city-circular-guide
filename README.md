# City Circular Guide - Trivandrum

by OIL ([Octilus Innovations Lab](https://octilus.in/))

![Logo](https://github.com/Octilus-Technologies/city-circular-guide/blob/main/docs/ccg_logo.png?raw=true)

City Circular Service is an innovative transportation network, introduced by KSRTC for the first time in the state of Kerala. The city to have the first launch will be Thiruvananthapuram. After this, it will be introduced in other major cities like Kozhikode, Kochi, etc. This is the first public transportation system in Kerala with Hope on Hope Off model.

This is a map-based digital platform for the ‘Trivandrum City Circular’ bus service. It will act as a guide to commuters.

## Screenshots

![App Screenshot](https://github.com/Octilus-Technologies/city-circular-guide/blob/main/docs/ccg_sh_1.png?raw=true)

![App Screenshot](https://github.com/Octilus-Technologies/city-circular-guide/blob/main/docs/ccg_sh_3.png?raw=true)

## Features

-   Show an interactive map of bus routes and interchange points.
-   Allow users to find a specific route.

## How it works

1. Initial geo location of the user gets fetched from the browser and reverse geo coded (using mapbox) to get area location
2. User can select this initial location or type in to search for a different location as a starting point
3. This input field shows current location, known bus stop, and all other areas of Trivandrum filtered and sorted by keystrokes
4. After the user selects `from` and `destination` locations, the app will store it in database and opens the journey page
5. This page finds best route based on bus circular and interchange placement
6. In order to draw the route on the map all the intermediate bus stops are sent to `mapbox` API to find a route (that follows the road)

## Demo

[City Circular Guide](https://ccg.octilus.in/)

## Stack

-   Laravel
-   Inertia
-   React.js
-   TypeScript
-   Tailwind
-   DaisyUI
-   Mapbox

## Setup

```bash
composer setup
```

## Serve

Serve laravel

```bash
php artisan serve
```

Start Vite compilation

```bash
npm run dev
```

## Future improvements

1. Route information is stored on front end as a JSON file for using with typescript. In future we may store these points in database and and get route back from backend.
2. Mapbox is used for drawing the route on the map. In future we may use `open street map` and `leaflet` to draw the route on the map.

## Support

For support, email hello@octilus.in.

