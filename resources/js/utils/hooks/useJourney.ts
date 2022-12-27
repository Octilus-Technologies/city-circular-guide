import { getOptimizedStops } from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import { BBox, bbox, center, lineString } from "@turf/turf";
import { useEffect, useState } from "react";
import { generateLayerFromGeometry, getStopDetails } from "../geoJson";
import { Coordinates } from "./../geoJson";

const useJourney = (
    mapAccessToken: string,
    from: Coordinates,
    destination: Coordinates
) => {
    const [paths, setPaths] =
        useState<ReturnType<typeof generateLayerFromGeometry>[]>();
    const [stops, setStops] = useState<
        {
            coordinates: Coordinates;
            name: string;
        }[][]
    >();
    const [meta, setMeta] = useState<any[]>();
    const [mapMeta, setMapMeta] = useState<{
        bbox: BBox;
        center: Coordinates;
    }>();

    useEffect(() => {
        const generatePathLayer = async () => {
            const segments = getOptimizedStops(from, destination);
            if (!segments || !segments.length) {
                return console.log("Unable to find a route");
            }

            const segmentPathPromises = segments.map((segment) =>
                getMatch(mapAccessToken, segment)
            );
            const segmentPath = await Promise.all(segmentPathPromises);

            const paths = segmentPath.map((path) =>
                generateLayerFromGeometry(path?.geometry)
            );
            const stops = segments.map((segment) => getStopDetails(segment));
            const meta = segmentPath.map((path) => path?.journey);

            const allCoordinates = paths.flatMap(
                (path) => path?.features[0].geometry?.coordinates
            );
            const boundingBox = bbox(lineString(allCoordinates as any));
            const mapCenter = center(lineString(allCoordinates as any));

            setPaths(paths);
            setStops(stops);
            setMeta(meta);
            setMapMeta({
                bbox: boundingBox,
                center: mapCenter.geometry?.coordinates as Coordinates,
            });
        };

        generatePathLayer();
    }, [from, destination]);

    return { paths, stops, meta, mapMeta };
};

export default useJourney;
