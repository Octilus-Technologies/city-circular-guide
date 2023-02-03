import { meta } from "@/constants/circulars";
import { filterNullValues, rotateArray } from "@/utils/arrayUtils";
import {
    CircularName,
    Coordinates,
    getAllStopDetails,
    getCircularCoordinates,
    getCirculars,
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
        isClockwise: boolean;
    } | null>((nearestStop, coordinates, i) => {
        const to = point(coordinates);
        const d = distance(from, to, { units: "meters" });

        if (!nearestStop || nearestStop.distance > d) {
            nearestStop = {
                index: i,
                coordinates,
                distance: d,
                isClockwise: nearestStop?.isClockwise ?? true,
            };
        }

        return nearestStop;
    }, null);

    return nearestStop;
};

const findNearbyStops = (coordinates: Coordinates, maxDistance?: number) => {
    const circulars = getCirculars();
    const circularNames = Object.keys(circulars) as CircularName[];
    const nearestStopsFromAllCirculars = circularNames.map((circularName) => {
        const circular = circulars[circularName];
        const nearestStop = findNearestStop(
            coordinates,
            circular.features.map((f) => f.geometry.coordinates)
        );

        if (!nearestStop) return null;

        if (maxDistance && nearestStop.distance > maxDistance) return null; // FIXME: not working as expected

        return {
            circularName: circularName,
            coordinates: nearestStop?.coordinates,
            distance: nearestStop?.distance,
            isClockwise: nearestStop.isClockwise,
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
    console.log(
        getStopDetails([from])[0].name,
        ": TO :",
        getStopDetails([destination])[0].name
    );
    console.log(
        "coordinates: ",
        getStopDetails(coordinates).map((s) => s.name)
    );

    const firstStop = findNearestStop(from, coordinates);
    if (!firstStop) return [];

    // coordinates = rotateArray(coordinates, firstStop?.index); // FIXME: consider anticlockwise path

    const lastStop = findNearestStop(destination, coordinates);
    if (!lastStop) return [];

    // Invalid route
    // if (lastStop.index < firstStop.index) return [];

    let stops = coordinates.slice(firstStop.index, lastStop.index + 1);

    console.log(getStopDetails(stops).map((s) => s.name));

    return stops;
};

const getOptimizedSegmentStops = (
    from: Coordinates,
    destination: Coordinates,
    circularName: CircularName
) => {
    const cwCoordinates = getCircularCoordinates(circularName);
    const acwCoordinates = getCircularCoordinates(circularName, false);
    const cwPath = findShortestPath(from, destination, cwCoordinates);
    const acwPath = findShortestPath(from, destination, acwCoordinates);

    const isClockwiseShorter =
        !!cwPath.length && cwPath.length < acwPath.length;
    let stops = isClockwiseShorter ? cwPath : acwPath;

    // const isWrongDirection =
    //     stops[0] !== from && stops[stops.length - 1] !== destination;
    // stops = isWrongDirection ? stops.reverse() : stops;
    // console.log(
    //     "finalStops",
    //     getStopDetails(stops).map((s) => s.name)
    // );

    return {
        stops: stops,
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

const bruteForceRoutes = (from: Coordinates, destination: Coordinates) => {
    const maxDistance = 200;
    const fromStops = findNearbyStops(from, maxDistance);
    const destinationStops = findNearbyStops(destination, maxDistance);

    const stopOptions: ReturnType<typeof getOptimizedStops>[] = [];
    fromStops.forEach((fromStop) => {
        destinationStops.forEach((destinationStop) => {
            const stops = getOptimizedStops(fromStop, destinationStop);
            if (stops.flatMap((segment) => segment.stops).length)
                stopOptions.push(stops);
        });
    });

    // shortest route based on number of stops
    // FIXME: must consider walking distance to the stop
    let shortestRoute = stopOptions.reduce((acc, curr) => {
        const isShorter =
            curr.flatMap((s) => s.stops).length >
            acc.flatMap((s) => s.stops).length;

        return isShorter ? curr : acc;
    }, stopOptions[0]);

    console.log("stopOptions", stopOptions);

    // shortestRoute = stopOptions[0];

    return shortestRoute;
};

const getOptimizedStops = <
    NearbyStop extends ReturnType<typeof findNearbyStops>[number]
>(
    fromStop: NearbyStop,
    destinationStop: NearbyStop
) => {
    // find nearby stop and circular
    if (!fromStop || !destinationStop) return [];

    console.log("fromStop", fromStop);
    console.log("destinationStop", destinationStop);
    const requiredCirculars = [fromStop];
    // FIXME: same circular interchange is required (anti circular)
    if (
        destinationStop.circularName !== fromStop.circularName ||
        destinationStop.isClockwise !== fromStop.isClockwise
    ) {
        requiredCirculars.push(destinationStop);
    }

    const segments: {
        circularName: CircularName;
        from: Coordinates;
        destination: Coordinates;
    }[] = [];
    console.log("requiredCirculars", requiredCirculars);

    requiredCirculars.map((stop, i) => {
        const nextStop = requiredCirculars[i + 1];

        if (!!nextStop) {
            const junctionCoordinates = findNearestJunction(
                getCircularCoordinates(stop.circularName),
                getCircularCoordinates(nextStop.circularName),
                stop.coordinates
            );
            // FIXME: unable to find a junction as the circulars are not connected
            // ! required more than 1 junction

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
        const stopSegments = getOptimizedSegmentStops(
            from,
            destination,
            circularName
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
    }[] = bruteForceRoutes(from.coords, destination.coords)?.map((segment) => ({
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
    const allCirculars = meta.map((circular) => ({
        ...circular,
        name: circular.name.toLowerCase().replace("-", ""),
    }));

    const circularDetails = allCirculars.find((circular) => {
        return (
            circular.name == name.toLowerCase() &&
            circular.isClockwise == isClockwise
        );
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
