import blueCircular from "@/constants/blue.json";
import brownCircular from "@/constants/brown.json";
import greenCircular from "@/constants/green.json";
import magentaCircular from "@/constants/magenta.json";
import redCircular from "@/constants/red.json";
import { filterNullValues } from "@/utils/arrayUtils";
import { getCircularDetails } from "@/utils/map-helpers";
import { distance, Feature, point } from "@turf/turf";

export type Coordinates = number[];
export type CircularName = keyof typeof circulars;
export type CircularGeojson = typeof circulars[CircularName];
export type PointFeatureCollection = CircularGeojson;
export type PointFeature = PointFeatureCollection["features"][number];
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

const generateLineStringFeature = (from: Coordinates, to: Coordinates) => {
    const feature: Feature = {
        type: "Feature",
        properties: {},
        geometry: {
            coordinates: [from, to],
            type: "LineString",
        },
    };

    return feature;
};

export function generateLineFromPoints(
    pointCollection: PointFeatureCollection
) {
    let lastPoint: PointFeature | undefined;
    const features = pointCollection.features.map((stop) => {
        lastPoint = stop;
        if (!lastPoint?.geometry || !stop?.geometry) return null;

        const from = lastPoint.geometry.coordinates;
        const to = stop.geometry.coordinates;

        return generateLineStringFeature(from, to);
    });

    const featureCollection = {
        type: "FeatureCollection",
        features: filterNullValues(features),
    };

    return featureCollection;
}

export const getAllStopDetails = (mustBeUnique = false, isClockwise = true) => {
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

    if (!mustBeUnique) return allStops;

    return allStops.reduce((uniqueStops, stop) => {
        const duplicateStop = uniqueStops.find(
            (s) =>
                s.name === stop.name &&
                s.circular?.name === stop.circular?.name &&
                s.coordinates[0] === stop.coordinates[0] &&
                s.coordinates[1] === stop.coordinates[1]
        );

        if (duplicateStop) return uniqueStops;

        uniqueStops.push(stop);

        return uniqueStops;
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
            ) {
                return false;
            }

            return s.coordinates[0] === c[0] && s.coordinates[1] === c[1];
        });
        if (!stop) return;

        const inCirculars = allStops
            .filter(
                (s) =>
                    distance(point(s.coordinates), point(stop.coordinates)) <
                    0.1
            ) // May change this comparison in future
            .map((s) => s.circular);

        const stopDetails = {
            ...stop,
            circulars: inCirculars,
        };

        return stopDetails;
    });

    return filterNullValues(stops);
};

export const getCircularCoordinates = (circularName: CircularName) => {
    return circulars[circularName].features.map((f) => f.geometry.coordinates);
};
