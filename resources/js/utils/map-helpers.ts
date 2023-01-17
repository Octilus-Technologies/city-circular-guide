import { distance, point } from "@turf/turf";
import circularMeta from "../constants/circulars";
import { CircularName, Coordinates, getStopDetails } from "./geoJson";
import {
    circulars,
    getAllStopDetails,
    getCircularCoordinates,
} from "./geoJson";

export const findNearestStop = (
    coordinates: Coordinates,
    stops: Coordinates[] = getAllStopDetails().map((s) => s.coordinates)
) => {
    // console.log("findNearestStop", coordinates);
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
            circularName: circularName,
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
    const tmpArr = [...arr]; // clone array to avoid mutation of original array
    for (let i = 0; i < times; i++) {
        const tmp = tmpArr.shift();
        if (tmp) tmpArr.push(tmp);
    }

    return tmpArr;
};

const findShortestPath = (
    from: Coordinates,
    destination: Coordinates,
    coordinates: Coordinates[]
) => {
    // console.log("findShortestPath", from, destination);
    const firstStop = findNearestStop(from, coordinates);
    if (!firstStop) return [];

    let adjustedCoordinates = rotateCoordinates(coordinates, firstStop?.index);

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
    // console.log("getOptimizedSegmentStops", {
    //     from: from,
    //     destination: destination,
    // });
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
    // console.log(optimizedStops[0], from);
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
    const junctions = circular1.filter((c1) => {
        return circular2.some((c2) => distance(point(c1), point(c2)) <= 0.1);
    });

    return junctions;
};

const findNearestJunction = (
    circular1: Coordinates[],
    circular2: Coordinates[],
    from: Coordinates
) => {
    const junctions = findJunctions(circular1, circular2);

    // FIXME: Should find the junction that leads to shortest route (not necessarily nearest)
    const nearest = junctions.reduce(
        (acc, curr) => {
            const dist = distance(point(from), point(curr));

            if (dist < acc.dist) {
                return {
                    dist,
                    coordinates: curr,
                };
            }

            return acc;
        },
        {
            dist: Infinity,
            coordinates: junctions[0],
        }
    );

    return nearest.coordinates;
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

    if (destinationStop.circularName !== fromStop.circularName) {
        requiredCirculars.push(destinationStop);
    }

    const segments: {
        circularName: CircularName;
        from: Coordinates;
        destination: Coordinates;
    }[] = [];

    requiredCirculars.map((stop, i) => {
        const nextStop = requiredCirculars[i + 1];

        if (!!nextStop) {
            const junctionCoordinates = findNearestJunction(
                getCircularCoordinates(stop.circularName),
                getCircularCoordinates(nextStop.circularName),
                nextStop.coordinates
            );

            // console.log({
            //     from: stop.circularName,
            //     to: nextStop.circularName,
            //     junctionCoordinates,
            // });

            segments.push({
                circularName: stop.circularName,
                from: stop.coordinates,
                destination: junctionCoordinates,
            });

            segments.push({
                circularName: nextStop.circularName,
                from: junctionCoordinates,
                destination: nextStop.coordinates,
            });

            console.table(segments);
        } else {
            if (stop.coordinates !== destinationStop.coordinates) {
                // * This gets executed if we are dealing with single circular
                // * or if it is the last (destination) circular
                segments.push({
                    circularName: stop.circularName,
                    from: stop.coordinates,
                    destination: destinationStop.coordinates,
                });
            }
        }
    });
    console.table(segments);

    const segmentStops = segments.map(({ circularName, from, destination }) => {
        const coordinates = getCircularCoordinates(circularName);
        return getOptimizedSegmentStops(from, destination, coordinates);
    });

    // Filter and return proper segments
    return segmentStops.filter((stops) => stops.length > 1);
};

const jsonToGeoJson = (
    data: {
        name_en: string;
        name_ml: string;
        lat: string;
        lng: string;
    }[]
) => {
    return data.map((stop) => ({
        type: "Feature",
        properties: { name: stop.name_en, name_ml: stop.name_ml },
        geometry: {
            coordinates: [parseFloat(stop?.lng), parseFloat(stop.lat)],
            type: "Point",
        },
    }));
};

export const getCircularDetails = (name: string, isClockwise = true) => {
    return circularMeta.meta.find((circular) => {
        return (
            circular.name.toLowerCase() == name &&
            circular.isClockwise == isClockwise
        );
    });
};
