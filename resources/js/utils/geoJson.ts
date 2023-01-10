import blueCircular from "@/constants/blue.json";
import redCircular from "@/constants/red.json";

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

export const getAllStopDetails = () => {
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

    return stops.flat();
};

export const getCircularDetails = (circularName: CircularName) => {
    return {
        name: circularName,
        color: circularColors[circularName],
    };
};

export const getStopDetails = (coordinates: Coordinates[]) => {
    const stops = coordinates.map((c) => {
        const stop = getAllStopDetails().find(
            (s) => s.coordinates[0] === c[0] && s.coordinates[1] === c[1]
        );
        if (!stop) return;

        const inCirculars = getAllStopDetails()
            .filter((s) => s.name === stop.name)
            .map((s) => s.circularName);

        const stopDetails = {
            ...stop,
            circulars: inCirculars.map(getCircularDetails),
        };

        return stopDetails;
    });

    return stops.filter(
        (s): s is NonNullable<typeof stops[number]> => s !== null
    );
};

export const getCircularCoordinates = (
    circularName: keyof typeof circulars
) => {
    return circulars[circularName].features.map((f) => f.geometry.coordinates);
};
