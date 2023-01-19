import blueCircular from "@/constants/blue.json";
import brownCircular from "@/constants/brown.json";
import greenCircular from "@/constants/green.json";
import magentaCircular from "@/constants/magenta.json";
import redCircular from "@/constants/red.json";
import { getCircularDetails } from "./map-helpers";

export type Coordinates = number[];
export type CircularName = keyof typeof circulars;
export type CircularGeojson = typeof circulars[CircularName];
export type PointFeatureCollection = CircularGeojson;
export type Geometry<TType extends string> = {
    coordinates: Coordinates;
    type: TType;
};
export type BusStopDetail = ReturnType<typeof getStopDetails>[number];

// * Register all circulars here
export const circulars = {
    blue: blueCircular,
    red: redCircular,
    green: greenCircular,
    magenta: magentaCircular,
    brown: brownCircular,
};

export const circularNames = Object.keys(circulars) as CircularName[];

export function generateLayerFromGeometry(geometry: Geometry<"LineString">) {
    // console.log({ geometry });
    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry,
            },
        ],
    };
}

export function generateLineFromPoints(
    pointCollection: PointFeatureCollection
) {
    let lastPoint: typeof pointCollection["features"][number] | null = null;

    return {
        type: "FeatureCollection",
        features: pointCollection.features
            .map((stop) => {
                if (!lastPoint?.geometry || !stop?.geometry) {
                    lastPoint = stop;
                    return null;
                }

                const feature = {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        coordinates: [
                            lastPoint.geometry.coordinates,
                            stop.geometry.coordinates,
                        ],
                        type: "LineString",
                    },
                };

                lastPoint = stop;
                return feature;
            })
            .filter((stop) => !!stop),
    };
}

export const getAllStopDetails = (unique = false, isClockwise = true) => {
    const stops = (Object.keys(circulars) as CircularName[]).map(
        (circularName) => {
            const circular = circulars[circularName];

            return circular.features.map((f) => ({
                coordinates: f.geometry.coordinates,
                name: f.properties.name,
                nameLocale: f.properties.name_ml,
                circular: {
                    ...getCircularDetails(circularName, isClockwise),
                    name: circularName,
                },
            }));
        }
    );

    const allStops = stops.flat();

    if (!unique) return allStops;

    return allStops.reduce((acc, stop) => {
        if (
            acc.find(
                (s) =>
                    s.name === stop.name &&
                    s.circular?.name === stop.circular?.name &&
                    s.coordinates[0] === stop.coordinates[0] &&
                    s.coordinates[1] === stop.coordinates[1]
            )
        )
            return acc;

        return [...acc, stop];
    }, [] as typeof allStops);
};

export const getStopDetails = (
    coordinates: Coordinates[],
    circularName?: CircularName,
    isClockwise?: boolean
) => {
    const allStops = getAllStopDetails(true, isClockwise);
    const stops = coordinates.map((c) => {
        const stop = allStops.find((s) => {
            if (circularName && s.circular?.name !== circularName) return false;
            if (
                isClockwise !== undefined &&
                s.circular?.isClockwise !== isClockwise
            )
                return false;

            return s.coordinates[0] === c[0] && s.coordinates[1] === c[1];
        });
        if (!stop) return;

        const inCirculars = allStops
            .filter((s) => s.coordinates === stop.coordinates) // May change this comparison in future
            .map((s) => s.circular);

        const stopDetails = {
            ...stop,
            circulars: inCirculars,
        };

        return stopDetails;
    });

    return stops.filter(
        (s): s is NonNullable<typeof stops[number]> => s !== null
    );
};

export const getCircularCoordinates = (circularName: CircularName) => {
    return circulars[circularName].features.map((f) => f.geometry.coordinates);
};
