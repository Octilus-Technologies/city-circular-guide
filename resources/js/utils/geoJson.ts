import circulars, { acwCirculars } from "@/constants/circulars";
import { filterNullValues } from "@/utils/arrayUtils";
import { getCircularDetails } from "@/utils/map-helpers";
import { distance, Feature, point } from "@turf/turf";

export type Coordinates = number[];
export type CircularName = keyof typeof circulars;
export type CircularGeojson = (typeof circulars)[CircularName];
export type PointFeatureCollection = CircularGeojson;
export type PointFeature = PointFeatureCollection["features"][number];
export type Geometry<TType extends string> = {
    coordinates: Coordinates;
    type: TType;
};
export type BusStopDetail = ReturnType<typeof getStopDetails>[number];

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

export const getCirculars = (isClockwise = true) => {
    return isClockwise ? circulars : acwCirculars;
};

export const getCircular = (circularName: CircularName, isClockwise = true) => {
    const allCirculars = getCirculars(isClockwise);
    const circular = allCirculars[circularName] ?? circulars[circularName];

    return circular;
};

export const getAllStopDetails = (
    mustBeUnique = false,
    circularNames?: CircularName[],
    isClockwise?: boolean
) => {
    circularNames ??= Object.keys(getCirculars()) as CircularName[];
    const stops = circularNames.map((circularName) => {
        const isClockwiseCircular = isClockwise ?? true;
        const circular = getCircular(circularName, isClockwiseCircular);

        const circularStops = circular.features.map((f) => ({
            coordinates: f.geometry.coordinates,
            name: f.properties.name,
            nameLocale: f.properties.name_ml,
            circular: {
                ...getCircularDetails(circularName, isClockwiseCircular),
                name: circularName,
            },
        }));

        if (isClockwise === null) {
            // Push anti circular routes
            const acwCircular = getCircular(circularName, false);
            const acwCircularStops = acwCircular.features.map((f) => ({
                coordinates: f.geometry.coordinates,
                name: f.properties.name,
                nameLocale: f.properties.name_ml,
                circular: {
                    ...getCircularDetails(circularName, false),
                    name: circularName,
                },
            }));

            circularStops.push(...acwCircularStops);
        }

        return circularStops;
    });

    const allStops = stops.flat();

    // attach junction info
    const allStopsWithCirculars = allStops.map((stop) => {
        const inCirculars = allStops
            .filter(
                (s) =>
                    distance(point(s.coordinates), point(stop.coordinates)) <
                        0.03 &&
                    s.circular.isClockwise === stop.circular?.isClockwise
            ) // May change this comparison in future
            .map((s) => s.circular);

        const uniqueCirculars = inCirculars.reduce((acc, circular) => {
            if (!acc.some((c) => c.name === circular.name)) {
                acc.push(circular);
            }

            return acc;
        }, [] as typeof inCirculars);

        return {
            ...stop,
            circulars: uniqueCirculars,
        };
    });

    if (!mustBeUnique) return allStopsWithCirculars;

    return allStopsWithCirculars.reduce((uniqueStops, stop) => {
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
    }, [] as typeof allStopsWithCirculars);
};

export const getStopDetails = (
    coordinates: Coordinates[],
    circularName?: CircularName,
    isClockwise: boolean = true
) => {
    const stops = coordinates.map((c) => {
        const stop = getAllStopDetails(
            undefined,
            circularName ? [circularName] : undefined,
            isClockwise
        ).find((s) => {
            // if (circularName && s.circular?.name !== circularName) return false;

            return s.coordinates[0] === c[0] && s.coordinates[1] === c[1];
        });
        if (!stop) return;

        return stop;
    });

    return filterNullValues(stops);
};

export const getCircularCoordinates = (
    circularName: CircularName,
    isClockwise = true
) => {
    const circular = getCircular(circularName, isClockwise);
    const stops = circular.features.map((f) => f.geometry.coordinates);

    return stops;
};
