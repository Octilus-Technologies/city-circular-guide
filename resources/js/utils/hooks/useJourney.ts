import { getOptimizedStops } from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import { BBox, bbox, center, distance, lineString, point } from "@turf/turf";
import { useEffect, useState } from "react";
import {
    CircularName,
    generateLayerFromGeometry,
    getStopDetails,
} from "../geoJson";
import { Coordinates } from "./../geoJson";
import { getCircularDetails } from "./../map-helpers";
import { Profile } from "./../mapbox-api";

type Path = Awaited<ReturnType<typeof getMatch>>;
type LocationSummary = {
    name: string;
    coords: Coordinates;
};
export type Segment = {
    layer: ReturnType<typeof generateLayerFromGeometry>;
    stops: ReturnType<typeof getStopDetails>;
    path?: Path;
    from: string;
    destination: string;
    circular: ReturnType<typeof getCircularDetails>;
};

const generateRouteSegments = (
    from: LocationSummary,
    destination: LocationSummary
) => {
    const segments: {
        stops: Coordinates[];
        profile: Profile;
        circular?: {
            name: CircularName;
            isClockwise: boolean;
        };
    }[] = getOptimizedStops(from.coords, destination.coords).map((segment) => ({
        ...segment,
        profile: "driving",
    }));
    if (!segments || !segments.length) {
        return console.log("Unable to find a route");
    }

    // Attach walking segments
    if (distance(point(from.coords), point(segments[0].stops[0])) > 0.1) {
        segments.unshift({
            stops: [from.coords, segments[0].stops[0]],
            profile: "walking",
        });
    }

    if (
        distance(
            point(destination.coords),
            point(segments[segments.length - 1].stops[1])
        ) > 0.1
    ) {
        const lastSegment = segments[segments.length - 1];
        segments.push({
            stops: [
                lastSegment.stops[lastSegment.stops.length - 1],
                destination.coords,
            ],
            profile: "walking",
        });
    }

    return segments;
};

const useJourney = (
    mapAccessToken: string,
    from: LocationSummary,
    destination: LocationSummary
) => {
    const [segments, setSegments] = useState<Segment[]>();
    const [mapMeta, setMapMeta] = useState<{
        bbox: BBox;
        center: Coordinates;
    }>();

    useEffect(() => {
        const generatePathLayer = async () => {
            // console.log("useJourney", from, destination);
            const segments = generateRouteSegments(from, destination);
            if (!segments) return;

            const segmentPathPromises = segments.map((segment) =>
                getMatch(mapAccessToken, segment.stops, segment.profile)
            );
            const segmentPath: {
                path?: Path;
            }[] = (await Promise.all(segmentPathPromises)).map((path) => ({
                path: path,
            }));

            const segmentLayers: Segment[] = segmentPath.map((segment, i) => {
                const stops =
                    segment.path?.profile == "driving"
                        ? getStopDetails(segments[i].stops)
                        : [];
                const circular = segments[i]?.circular ?? "";

                return {
                    path: segment.path ?? undefined,
                    layer: generateLayerFromGeometry(segment?.path?.geometry),
                    stops: stops,
                    from: stops[0]?.name ?? "",
                    destination: stops[stops.length - 1]?.name ?? "",
                    circular: circular
                        ? getCircularDetails(
                              circular.name,
                              circular.isClockwise
                          )
                        : undefined,
                };
            });

            // Hydrate walking segments
            segmentLayers.forEach((segment, i) => {
                if (segment.path?.profile == "walking") {
                    const fromStop = segmentLayers[i - 1];
                    segment.from = fromStop
                        ? `${fromStop.destination} stop`
                        : from.name.split(",")[0];

                    const destinationStop = segmentLayers[i + 1];
                    segment.destination = destinationStop
                        ? `${destinationStop.from} stop`
                        : destination.name.split(",")[0];
                }
            });

            const allCoordinates = segmentLayers
                .flatMap(
                    (segment) =>
                        segment.layer?.features?.[0].geometry?.coordinates
                )
                .filter((c) => !!c);
            const boundingBox = bbox(lineString(allCoordinates as any));
            const mapCenter = center(lineString(allCoordinates as any));

            setSegments(segmentLayers);
            console.log("segmentLayers", segmentLayers);
            setMapMeta({
                bbox: boundingBox,
                center: mapCenter.geometry?.coordinates as Coordinates,
            });
        };

        generatePathLayer();
    }, [from, destination]);

    return { segments, mapMeta };
};

export default useJourney;
