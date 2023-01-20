import circularMeta from "@/constants/circulars";
import { filterNullValues, rotateArray } from "@/utils/arrayUtils";
import {
    CircularName,
    circulars,
    Coordinates,
    getAllStopDetails,
    getCircularCoordinates,
    getStopDetails,
} from "@/utils/geoJson";
import { Profile } from "@/utils/mapbox-api";
import { distance, point } from "@turf/turf";

export type LocationSummary = {
    name: string;
    coords: Coordinates;
};

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
            circularName: circularName,
            coordinates: nearestStop?.coordinates,
            distance: nearestStop?.distance,
        };
    });

    // sort by distances
    const sortedStops = nearestStopsFromAllCirculars.sort(
        (a, b) => (a?.distance ?? 0) - (b?.distance ?? 0)
    );
    const filteredStops = filterNullValues(sortedStops);

    // return max 3 nearest stops
    return filteredStops.slice(0, Math.min(sortedStops.length, 3));
};

const findShortestPath = (
    from: Coordinates,
    destination: Coordinates,
    coordinates: Coordinates[]
) => {
    const firstStop = findNearestStop(from, coordinates);
    if (!firstStop) return [];

    let adjustedCoordinates = rotateArray(coordinates, firstStop?.index);

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

    const isWrongDirection =
        optimizedStops[0] !== from &&
        optimizedStops[optimizedStops.length - 1] !== destination;
    optimizedStops = isWrongDirection
        ? optimizedStops.reverse()
        : optimizedStops;

    return {
        stops: optimizedStops,
        isClockwise: isClockwiseShorter,
    };
};

const calculateCost = (
    stop1: Coordinates,
    stop2: Coordinates,
    circularName: CircularName
) => {
    let circularCoordinates = getCircularCoordinates(circularName);
    const stop1Index = circularCoordinates.indexOf(stop1);
    circularCoordinates = rotateArray(circularCoordinates, stop1Index);
    // console.log(getStopDetails(circularCoordinates).map((s) => s.name));

    const stop2Index = circularCoordinates.indexOf(stop2);
    const clockwiseStops = Math.abs(stop2Index - 0);
    const counterClockwiseStops = circularCoordinates.length - clockwiseStops;

    return Math.min(clockwiseStops, counterClockwiseStops);
};

const findJunctions = (
    circular1: Coordinates[],
    circular2: Coordinates[],
    maxDist = 0.1
) => {
    const junctions = circular1.filter((c1) => {
        return circular2.some(
            (c2) => distance(point(c1), point(c2)) <= maxDist
        );
    });

    return junctions;
};

const findNearestJunction = (
    circular1: Coordinates[],
    circular2: Coordinates[],
    from: Coordinates
) => {
    const junctions = findJunctions(circular1, circular2);
    const fromStop = getStopDetails([from])[0];

    const nearest = junctions.reduce(
        (acc, curr) => {
            const circularName = fromStop.circular?.name as CircularName;
            // number of intermediate stops
            const cost = calculateCost(from, curr, circularName);

            if (cost < acc.cost) {
                return {
                    cost,
                    coordinates: curr,
                };
            }

            return acc;
        },
        {
            cost: Infinity,
            coordinates: junctions[0],
        }
    );

    return nearest.coordinates;
};

const getOptimizedStops = (from: Coordinates, destination: Coordinates) => {
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
                stop.coordinates
            );

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

    const segmentStops = segments.map(({ circularName, from, destination }) => {
        const coordinates = getCircularCoordinates(circularName);
        const stopSegments = getOptimizedSegmentStops(
            from,
            destination,
            coordinates
        );

        return {
            stops: stopSegments.stops,
            circular: {
                name: circularName,
                isClockwise: stopSegments.isClockwise,
            },
        };
    });

    // Filter and return proper segments
    return segmentStops.filter((segment) => segment.stops.length > 1);
};

export const generateRouteSegments = (
    from: LocationSummary,
    destination: LocationSummary
) => {
    const segments: {
        stops: Coordinates[];
        profile: Profile;
        circular?: {
            name: CircularName;
            isClockwise: boolean;
        };
    }[] = getOptimizedStops(from.coords, destination.coords).map((segment) => ({
        ...segment,
        profile: "driving",
    }));
    if (!segments || !segments.length) {
        return console.log("Unable to find a route");
    }

    // Attach walking segments
    const distanceToFirstStop = distance(
        point(from.coords),
        point(segments[0].stops[0])
    );
    if (distanceToFirstStop > 0.1) {
        segments.unshift({
            stops: [from.coords, segments[0].stops[0]],
            profile: "walking",
        });
    }

    const distanceFromLastStop = distance(
        point(destination.coords),
        point(segments[segments.length - 1].stops[1])
    );
    if (distanceFromLastStop > 0.1) {
        const lastSegment = segments[segments.length - 1];

        segments.push({
            stops: [
                lastSegment.stops[lastSegment.stops.length - 1],
                destination.coords,
            ],
            profile: "walking",
        });
    }

    return segments;
};

export const getCircularDetails = (name: CircularName, isClockwise = true) => {
    const allCirculars = circularMeta.meta.map((circular) => ({
        ...circular,
        name: circular.name.toLowerCase(),
    }));

    const circularDetails = allCirculars.find((circular) => {
        return circular.name == name && circular.isClockwise == isClockwise;
    });

    return circularDetails;
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
