import blueCircular from "@/constants/blue.json";
import redCircular from "@/constants/red.json";

type PointFeatureCollection = typeof blueCircular;
type Geometry<TType extends string> = {
    coordinates: number[];
    type: TType;
};

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

export const getStopDetails = (coordinates: number[][], filter = false) => {
    return coordinates
        .map((c) => {
            const stop = blueCircular.features.find(
                (f) => f.geometry.coordinates === c
            );
            return {
                coordinates: stop?.geometry.coordinates,
                name: stop?.properties.name,
            };
        })
        .filter((f) => (filter ? !!f : true));
};
