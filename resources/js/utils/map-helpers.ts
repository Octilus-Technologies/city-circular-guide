import { distance, point } from "@turf/turf";
import { circulars } from "./geoJson";

type Coordinates = number[];

type CircularGeojson = typeof circulars["blue"];

export const findNearestStop = (
    coordinates: Coordinates,
    stops: number[][]
) => {
    let from = point(coordinates);

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

const findNearbyStops = (coordinates: Coordinates) => {
    const nearestStopsFromAllCirculars = Object.keys(circulars).map(
        (circularName) => {
            const circular = circulars[
                circularName
            ] as typeof circulars["blue"];
            const nearestStop = findNearestStop(
                coordinates,
                circular.features.map((f) => f.geometry.coordinates)
            );

            if (!nearestStop) return null;

            return {
                name: circularName,
                coordinates: nearestStop?.coordinates,
                distance: nearestStop?.distance,
            };
        }
    );

    // sort by distances
    const sortedStops = nearestStopsFromAllCirculars
        .filter((data) => data)
        .sort((a, b) => (a?.distance ?? 0) - (b?.distance ?? 0));

    // return max 3 nearest stops
    return sortedStops.slice(0, Math.min(sortedStops.length, 3));
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

const getOptimizedSegmentStops = (from, destination, coordinates) => {
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

const findJunctions = (circular1: Coordinates[], circular2: Coordinates[]) => {
    const junctions = circular1.filter((c1) =>
        circular2.some((c2) => c1[0] === c2[0] && c1[1] === c2[1])
    );

    return junctions;
};

export const getOptimizedStops = (
    from: Coordinates,
    destination: Coordinates
): number[][][] => {
    // check if from and destination belongs to different circulars
    const fromCircular = findNearbyStops(from)[0];
    const destinationCircular = findNearbyStops(destination)[0];

    const requiredCirculars = [fromCircular];
    if (destinationCircular?.name !== fromCircular?.name) {
        requiredCirculars.push(destinationCircular);
    }

    const segments = requiredCirculars.map((circular) => {
        const coordinates = requiredCirculars
            .map((c) =>
                circulars[c?.name ?? ""].features.map(
                    (f) => f.geometry.coordinates
                )
            )
            .slice(0, 2);

        return getOptimizedSegmentStops(
            from,
            coordinates.length > 1
                ? findJunctions(coordinates[0], coordinates[1])
                : destination,
            circulars[circular?.name ?? ""].features.map(
                (f) => f.geometry.coordinates
            )
        );
    });

    return segments;
};
