import geoJson from "@/constants/blue.json";

type PointFeatureCollection = typeof geoJson;

export function generateLineFromPoints(pointCollection: PointFeatureCollection) {
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
