import geoJson from "@/constants/blue.json";

type PointFeatureCollection = typeof geoJson;
type Geometry<TType extends string> = {
    coordinates: number[];
    type: TType;
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

export const getStopDetails = (coordinates: number[][], filter = false) => {
    return coordinates
        .map((c) => {
            const stop = geoJson.features.find(
                (f) => f.geometry.coordinates === c
            );
            return {
                coordinates: stop?.geometry.coordinates,
                name: stop?.properties.name,
            };
        })
        .filter((f) => (filter ? !!f : true));
};
