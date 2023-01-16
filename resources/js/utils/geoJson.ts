import blueCircular from "@/constants/blue.json";
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
};

export const circularNames = Object.keys(circulars) as CircularName[];

// TODO: Remove all reference to these colors
export const circularColors: Record<CircularName, string> = {
    blue: "hsl(239, 100%, 70%)",
    red: "hsl(0, 100%, 70%)",
} as const;

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

export const getAllStopDetails = (unique = false) => {
    const stops = (Object.keys(circulars) as CircularName[]).map(
        (circularName) => {
            const circular = circulars[circularName];

            return circular.features.map((f) => ({
                coordinates: f.geometry.coordinates,
                name: f.properties.name,
                nameLocale: f.properties.name_ml,
                circularName: circularName,
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
                    s.circularName === stop.circularName &&
                    s.coordinates[0] === stop.coordinates[0] &&
                    s.coordinates[1] === stop.coordinates[1]
            )
        )
            return acc;

        return [...acc, stop];
    }, [] as typeof allStops);
};

export const getStopDetails = (coordinates: Coordinates[]) => {
    const allStops = getAllStopDetails(true);
    const stops = coordinates.map((c) => {
        const stop = allStops.find(
            (s) => s.coordinates[0] === c[0] && s.coordinates[1] === c[1]
        );
        if (!stop) return;

        const inCirculars = allStops
            .filter((s) => s.name === stop.name)
            .map((s) => s.circularName);
        const isClockwise = true; // FIXME: Improve this

        const stopDetails = {
            ...stop,
            circulars: inCirculars.map((name) =>
                getCircularDetails(name, isClockwise)
            ),
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
