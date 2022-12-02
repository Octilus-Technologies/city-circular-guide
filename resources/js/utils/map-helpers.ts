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

const rotateCoordinates = <T>(arr: Array<T>, times: number) => {
    for (let index = 0; index < times; index++) {
        arr.push(arr.shift() as any);
    }

    return arr;
};

const findShortestPath = (
    from: Coordinates,
    destination: Coordinates,
    coordinates: number[][]
) => {
    const firstStop = findNearestStop(from, coordinates);
    if (!firstStop) return [];

    const adjustedCoordinates = rotateCoordinates(
        coordinates,
        firstStop?.index
    );
    const lastStop = findNearestStop(destination, adjustedCoordinates);
    if (!lastStop) return [];

    return adjustedCoordinates.slice(0, lastStop.index + 1);
};

export const getOptimizedStops = (
    from: Coordinates,
    destination: Coordinates
): number[][] => {
    const coordinates = blueRoute.features.map((f) => f.geometry.coordinates);
    const clockwisePath = findShortestPath(from, destination, coordinates);
    const counterClockwisePath = findShortestPath(
        destination,
        from,
        coordinates
    );

    const isClockwiseShorter =
        clockwisePath.length < counterClockwisePath.length;
    const optimizedStops = isClockwiseShorter
        ? clockwisePath
        : counterClockwisePath;

    console.table(optimizedStops);

    return optimizedStops;
};
