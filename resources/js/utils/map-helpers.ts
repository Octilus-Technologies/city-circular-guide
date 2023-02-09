import { meta } from "@/constants/circulars";
import { filterNullValues, rotateArray } from "@/utils/arrayUtils";
import {
    BusStopDetail,
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
    stops: BusStopDetail[] = getAllStopDetails()
) => {
    let from = point(coordinates);

    const nearestStop = stops.reduce<{
        index: number;
        distance: number;
        stop: BusStopDetail;
    } | null>((nearestStop, stop, i) => {
        const to = point(stop.coordinates);
        const d = distance(from, to, { units: "meters" });

        if (!nearestStop || nearestStop.distance > d) {
            nearestStop = {
                index: i,
                distance: d,
                stop: stop,
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
        const nearestStop = findNearestStop(
            coordinates,
            getAllStopDetails(undefined, [circularName])
        );
        if (!nearestStop) return null;

        return {
            ...nearestStop.stop,
            distance: nearestStop.distance,
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
    circularName: CircularName,
    isClockwise: boolean
) => {
    let stops = getAllStopDetails(undefined, [circularName], isClockwise);
    // For debugging
    // const fromDetail = getStopDetails([from])[0].name;
    // const destinationDetail = getStopDetails([destination])[0].name;
    // const CoordinatesDetail = getStopDetails(coordinates).map((s) => s.name);

    let firstStop = findNearestStop(from, stops);
    if (!firstStop) return [];

    stops = rotateArray(stops, firstStop?.index);

    const lastStop = findNearestStop(destination, stops);
    if (!lastStop) return [];

    firstStop = findNearestStop(from, stops); // just to confirm (if rotated)

    let optimizedStops = stops.slice(firstStop?.index, lastStop.index + 1);

    return optimizedStops;
};

const getOptimizedSegmentStops = (
    from: Coordinates,
    destination: Coordinates,
    circularName: CircularName
) => {
    const cwPath = findShortestPath(from, destination, circularName, true);
    const acwPath = findShortestPath(from, destination, circularName, false);

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
    const maxDistance = 300;
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

    // shortest route based on stops and walking distance
    let shortestRoute = stopOptions.reduce(
        (shortRoute, curr) => {
            const allStops = curr.flatMap((s) => s.stops);
            const walkingCost = getWalkingCost(
                from,
                destination,
                allStops.map((s) => s.coordinates)
            );
            const currentRouteCost = allStops.length + walkingCost;
            const isShorter = currentRouteCost < shortRoute.cost;

            if (isShorter) {
                return {
                    cost: currentRouteCost,
                    stops: curr,
                };
            }

            return shortRoute;
        },
        {
            cost: Infinity,
            stops: stopOptions[0],
        }
    );

    // console.log("stopOptions", stopOptions);
    console.log("shortestRoute", shortestRoute);

    return shortestRoute.stops;
};

const getOptimizedStops = <
    NearbyStop extends ReturnType<typeof findNearbyStops>[number]
>(
    fromStop: NearbyStop,
    destinationStop: NearbyStop
) => {
    // find nearby stop and circular
    if (!fromStop || !destinationStop) return [];

    // console.log("fromStop", fromStop);
    // console.log("destinationStop", destinationStop);
    const commonCircular = fromStop.circulars.find((fc) =>
        destinationStop.circulars.some((dc) => fc.name === dc.name)
    );

    const fromCircular = commonCircular ?? fromStop.circular;
    const toCircular = commonCircular ?? destinationStop.circular;

    const requiredCirculars = [fromCircular];
    // FIXME: same circular interchange is required (if reached the terminus)
    // Temporarily fixed the above issue by rotating the circulars array

    // Add intermediate circulars
    if (
        fromCircular.name !== toCircular.name ||
        fromCircular.isClockwise !== toCircular.isClockwise
    ) {
        const interchange = findNearestJunction(
            getCircularCoordinates(fromCircular.name, fromCircular.isClockwise),
            getCircularCoordinates(toCircular.name, toCircular.isClockwise),
            fromStop.coordinates
        );

        if (!interchange) {
            console.warn(
                `No junction between ${fromCircular.name} and ${toCircular.name}`
            );

            const bridgeCirculars = getAllStopDetails()
                .filter((s) =>
                    s.circulars.some((c) => c.name === fromCircular.name)
                )
                .filter((s) => s.circular.name === toCircular.name)
                .map((s) => s.circular);
            const bridgeCircular = bridgeCirculars[0];

            if (
                bridgeCircular &&
                bridgeCircular.name !== toCircular.name &&
                bridgeCircular.isClockwise !== toCircular.isClockwise
            ) {
                requiredCirculars.push(bridgeCircular);
            }

            console.warn(
                "bridgeCirculars",
                bridgeCircular.name,
                toCircular.name
            );
        }

        requiredCirculars.push(toCircular);
    }

    const segments: {
        circularName: CircularName;
        from: Coordinates;
        destination: Coordinates;
    }[] = [];
    // console.log("requiredCirculars", requiredCirculars);

    requiredCirculars.map((circular, i) => {
        const nextCircular = requiredCirculars[i + 1];

        if (!!nextCircular) {
            const junctionCoordinates = findNearestJunction(
                getCircularCoordinates(circular.name, circular.isClockwise),
                getCircularCoordinates(
                    nextCircular.name,
                    nextCircular.isClockwise
                ),
                fromStop.coordinates
            );

            segments.push({
                circularName: circular.name,
                from: fromStop.coordinates,
                destination: junctionCoordinates,
            });

            segments.push({
                circularName: nextCircular.name,
                from: junctionCoordinates,
                destination: destinationStop.coordinates,
            });
        } else {
            const lastSegment = segments[segments.length - 1];
            if (lastSegment?.destination !== destinationStop.coordinates) {
                // * This gets executed if we are dealing with single circular
                // * or if it is the last (destination) circular
                segments.push({
                    circularName: circular.name,
                    from: fromStop.coordinates,
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
        stops: BusStopDetail[] | Pick<BusStopDetail, "coordinates">[];
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
        point(segments[0].stops[0].coordinates)
    );
    if (distanceToFirstStop > 0.1) {
        segments.unshift({
            stops: [
                {
                    coordinates: from.coords,
                },
                segments[0].stops[0],
            ],
            profile: "walking",
        });
    }

    const distanceFromLastStop = distance(
        point(destination.coords),
        point(segments[segments.length - 1].stops[1].coordinates)
    );
    if (distanceFromLastStop > 0.1) {
        const lastSegment = segments[segments.length - 1];

        segments.push({
            stops: [
                lastSegment.stops[lastSegment.stops.length - 1],
                {
                    coordinates: destination.coords,
                },
            ],
            profile: "walking",
        });
    }

    return segments;
};

export const getCircularDetails = (name: CircularName, isClockwise = true) => {
    const allCirculars = meta.map((circular) => ({
        ...circular,
        name: circular.name.toLowerCase().replace("-", "_"),
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

function getWalkingCost(
    from: Coordinates,
    destination: Coordinates,
    stops: Coordinates[]
) {
    const WEIGHTAGE = 200;

    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];
    const coords = [
        [from, firstStop],
        [lastStop, destination],
    ];
    const distances = coords.map(([a, b]) => distance(point(a), point(b)));
    const totalDistance = distances.reduce((acc, curr) => acc + curr, 0);

    return Math.round(totalDistance * WEIGHTAGE);
}
