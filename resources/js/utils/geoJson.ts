import blueCircular from "@/constants/blue.json";
import redCircular from "@/constants/red.json";

export type Coordinates = number[];
export type CircularName = keyof typeof circulars;
export type CircularGeojson = typeof circulars[CircularName];
export type PointFeatureCollection = CircularGeojson;
export type Geometry<TType extends string> = {
    coordinates: number[];
    type: TType;
};

// Register all circulars here
export const circulars = {
    blue: blueCircular,
    red: redCircular,
};

export function generateLayerFromGeometry(geometry: Geometry<"LineString">) {
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

const getAllStopDetails = () => {
    const stops = (Object.keys(circulars) as CircularName[]).map(
        (circularName) => {
            const circular = circulars[circularName];

            return circular.features.map((f) => ({
                coordinates: f.geometry.coordinates,
                name: f.properties.name,
            }));
        }
    );

    return stops.flat();
};

export const getStopDetails = (coordinates: Coordinates[]) => {
    const stops = coordinates.map((c) => {
        const stop = getAllStopDetails().find(
            (s) => s.coordinates[0] === c[0] && s.coordinates[1] === c[1]
        );
        if (!stop) return;

        return { ...stop };
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
