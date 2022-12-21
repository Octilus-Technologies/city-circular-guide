import { distance, point } from "@turf/turf";
import {
    CircularName,
    circulars,
    Coordinates,
    getAllStopDetails,
    getCircularCoordinates,
} from "./geoJson";

export const findNearestStop = (
    coordinates: Coordinates,
    stops: Coordinates[] = getAllStopDetails().map((s) => s.coordinates)
) => {
    let from = point(coordinates);

    const nearestStop = stops.reduce<{
        index: number;
        coordinates: Coordinates;
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
    const circularNames = Object.keys(circulars) as CircularName[];
    const nearestStopsFromAllCirculars = circularNames.map((circularName) => {
        const circular = circulars[circularName];
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
    });

    // sort by distances
    const sortedStops = nearestStopsFromAllCirculars
        .filter((data) => data)
        .sort((a, b) => (a?.distance ?? 0) - (b?.distance ?? 0));

    // return max 3 nearest stops
    return sortedStops.slice(0, Math.min(sortedStops.length, 3));
};

const rotateCoordinates = <T>(arr: Array<T>, times: number) => {
    for (let i = 0; i < times; i++) {
        const tmp = arr.shift();
        if (tmp) arr.push(tmp);
    }

    return arr;
};

const findShortestPath = (
    from: Coordinates,
    destination: Coordinates,
    coordinates: Coordinates[]
) => {
    const firstStop = findNearestStop(from, coordinates);
    if (!firstStop) return [];

    const adjustedCoordinates = rotateCoordinates(
        coordinates,
        firstStop?.index
    );
    const lastStop = findNearestStop(destination, adjustedCoordinates);
    if (!lastStop) return [];

    const stops = adjustedCoordinates.slice(0, lastStop.index + 1);

    return stops;
};

const getOptimizedSegmentStops = (
    from: Coordinates,
    destination: Coordinates,
    coordinates: Coordinates[]
) => {
    const clockwisePath = findShortestPath(from, destination, coordinates);
    const counterClockwisePath = findShortestPath(
        destination,
        from,
        coordinates
    );

    const isClockwiseShorter =
        clockwisePath.length < counterClockwisePath.length;
    let optimizedStops = isClockwiseShorter
        ? clockwisePath
        : counterClockwisePath;

    // making sure the the hop on - hop off stops are in the correct order
    console.log(optimizedStops[0], from);
    const isWrongDirection =
        optimizedStops[0] !== from &&
        optimizedStops[optimizedStops.length - 1] !== destination;
    optimizedStops = isWrongDirection
        ? optimizedStops.reverse()
        : optimizedStops;

    // console.table(optimizedStops);

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
): Coordinates[][] => {
    // find nearby stop and circular
    const fromStop = findNearbyStops(from)[0];
    const destinationStop = findNearbyStops(destination)[0];
    if (!fromStop || !destinationStop) return [];

    const requiredCirculars = [fromStop];

    if (destinationStop.name !== fromStop.name) {
        requiredCirculars.push(destinationStop);
    }

    const segments: {
        name: CircularName;
        from: Coordinates;
        destination: Coordinates;
    }[] = [];

    requiredCirculars.map((circular, i) => {
        const nextCircular = requiredCirculars[i + 1];

        if (!!nextCircular) {
            const junctionCoordinates = findJunctions(
                getCircularCoordinates(circular.name),
                getCircularCoordinates(nextCircular.name)
            )[0]; // * Just taking the first junction for testing

            segments.push({
                name: circular.name,
                from: circular.coordinates,
                destination: junctionCoordinates,
            });

            segments.push({
                name: nextCircular.name,
                from: junctionCoordinates,
                destination: nextCircular.coordinates,
            });

            console.table(segments);
        } else {
            if (circular.coordinates !== destinationStop.coordinates) {
                // * This gets executed if we are dealing with single circular
                // * or if it is the last (destination) circular
                segments.push({
                    name: circular.name,
                    from: circular.coordinates,
                    destination: destinationStop.coordinates,
                });
            }
        }
    });
    // console.table(segments);

    const segmentStops = segments.map(({ name, from, destination }) => {
        const coordinates = getCircularCoordinates(name);
        return getOptimizedSegmentStops(from, destination, coordinates);
    });

    // Filter and return proper segments
    return segmentStops.filter((stops) => stops.length > 1);
};
