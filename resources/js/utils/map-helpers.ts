import { point, distance } from "@turf/turf";
import blueRoute from "@/constants/blue.json";

type Coordinates = {
    lng: number;
    lat: number;
};

export const findNearestStop = (
    coordinates: Coordinates,
    stops: number[][]
) => {
    let from = point([coordinates.lng, coordinates.lat]);

    const nearestStop = stops.reduce<{
        index: number;
        coordinates: number[];
        distance: number;
    } | null>((nearestStop, coordinates, i) => {
        const to = point(coordinates);
        const d = distance(from, to, { units: "meters" });

        if (!nearestStop || nearestStop.distance > d) {
            nearestStop = {
                index: i,
                coordinates,
                distance: d,
            };
        }

        return nearestStop;
    }, null);

    return nearestStop;
};

export const getOptimizedStops = (
    from: Coordinates,
    destination: Coordinates
): number[][] => {
    const coordinates = blueRoute.features.map((f) => f.geometry.coordinates);

    const firstStop = findNearestStop(from, coordinates);
    const lastStop = findNearestStop(destination, coordinates);
    if (!firstStop || !lastStop) return [];

    const isClockwise = firstStop.index < lastStop.index; // ! probably incomplete logic
    const optimizedStops = isClockwise
        ? coordinates.slice(firstStop.index, lastStop.index + 1)
        : coordinates.slice(lastStop.index, firstStop.index + 1).reverse();

    return optimizedStops;
};
