import { getOptimizedStops } from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import { useEffect, useState } from "react";
import {
    circulars,
    generateLayerFromGeometry,
    getStopDetails,
} from "../geoJson";
import { Coordinates } from "./../geoJson";

const useJourney = (
    mapAccessToken: string,
    from: Coordinates,
    destination: Coordinates
) => {
    const [paths, setPaths] = useState<any>();
    const [stops, setStops] = useState<
        {
            coordinates: number[];
            name: string;
        }[][]
    >();
    const [meta, setMeta] = useState<any[]>();

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
                generateLayerFromGeometry(path?.geometry as any)
            );
            const stops = segments.map((segment) => getStopDetails(segment));
            const meta = segmentPath.map((path) => path?.journey);

            setPaths(paths);
            setStops(stops);
            setMeta(meta);
        };

        generatePathLayer();
    }, [circulars.blue, from, destination]);

    return { paths, stops, meta };
};

export default useJourney;
