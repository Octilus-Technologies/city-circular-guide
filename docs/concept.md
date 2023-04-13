# Concept

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

## Future improvements

1. Route information is stored on front end as a JSON file for using with typescript. In future we may store these points in database and and get route back from backend.
2. Mapbox is used for drawing the route on the map. In future we may use `open street map` and `leaflet` to draw the route on the map.
