import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CircularName,
    circulars as circularGeoJson,
    Coordinates,
    generateLayerFromGeometry,
    getCircularCoordinates,
    getStopDetails,
} from "../geoJson";
import { getCircularDetails } from "../map-helpers";
import { getMatch } from "../mapbox-api";

export type CircularData = {
    name: CircularName;
    color: string;
    path: {
        type: string;
        features: {
            type: string;
            properties: Object;
            geometry: Object;
        }[];
    };
    stops: {
        coordinates: number[];
        name: string;
    }[];
    isActive: boolean;
};

const useCirculars = (mapAccessToken: string) => {
    const [circularsData, setCircularsData] = useState<CircularData[]>([]);

    const isAllActive = useMemo(() => {
        return circularsData.every((circular) => circular.isActive);
    }, [circularsData]);

    const toggleCircularPath = useCallback(
        (index?: number) => {
            // TODO: use some unique ID instead of index
            if (index !== undefined) {
                setCircularsData((prevData) => {
                    const newData = [...prevData];
                    newData[index].isActive = !newData[index].isActive;
                    return newData;
                });

                return;
            }

            setCircularsData((prevData) => {
                const newData = [...prevData];
                newData.forEach((circular) => {
                    circular.isActive = !isAllActive;
                });
                return newData;
            });
        },
        [isAllActive]
    );

    useEffect(() => {
        const generatePathLayer = async () => {
            const circularNames = Object.keys(
                circularGeoJson
            ) as CircularName[];
            let segments: Coordinates[][] = circularNames.map((key) =>
                getCircularCoordinates(key)
            );

            // Add first stop as last stop to make it circular
            segments = segments.map((stops) => [...stops, stops[0]]);

            const segmentPathPromises = segments.map((segment) =>
                getMatch(mapAccessToken, segment)
            );
            const segmentPath = await Promise.all(segmentPathPromises);

            const paths = segmentPath.map((path) =>
                generateLayerFromGeometry(path?.geometry as any)
            );
            const stops = segments.map((segment) => getStopDetails(segment));
            // const meta = segmentPath.map((path) => path?.journey);

            const circularsData = circularNames.map((name, index) => {
                const circularData = {
                    name,
                    color: getCircularDetails(name)?.color ?? "#000",
                    path: paths[index],
                    stops: stops[index],
                    isActive: true,
                };

                return circularData;
            });

            setCircularsData(circularsData);
        };

        generatePathLayer();
    }, [circularGeoJson, mapAccessToken]);

    return {
        circulars: circularsData,
        geoJson: circularGeoJson,
        toggleCircularPath,
        isAllActive,
    };
};

export default useCirculars;
