import {
    Coordinates,
    generateLayerFromGeometry,
    getStopDetails,
} from "@/utils/geoJson";
import {
    generateRouteSegments,
    getCircularDetails,
    LocationSummary,
} from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import { BBox, bbox, center, lineString } from "@turf/turf";
import { useEffect, useState } from "react";

type Path = Awaited<ReturnType<typeof getMatch>>;

export type Segment = {
    layer: ReturnType<typeof generateLayerFromGeometry>;
    stops: ReturnType<typeof getStopDetails>;
    path?: Path;
    from: string;
    destination: string;
    circular: ReturnType<typeof getCircularDetails>;
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
        (async () => {
            // console.log("useJourney", from, destination);
            const stopSegments = generateRouteSegments(from, destination);
            if (!stopSegments) return;

            const pathSegmentPromises = stopSegments.map((segment) =>
                getMatch(mapAccessToken, segment.stops, segment.profile)
            );
            let pathSegments: {
                path?: Path;
            }[] = (await Promise.all(pathSegmentPromises)).map((path) => ({
                path: path,
            }));

            let segmentLayers: Segment[] = pathSegments.map((segment, i) => {
                const stopSegment = stopSegments[i];
                const circular = stopSegment?.circular;
                const stops =
                    segment.path?.profile == "driving"
                        ? getStopDetails(
                              stopSegment.stops,
                              circular?.name,
                              circular?.isClockwise
                          )
                        : [];
                const layer = generateLayerFromGeometry(
                    segment?.path?.geometry
                );
                const circularDetails = circular
                    ? getCircularDetails(circular.name, circular.isClockwise)
                    : undefined;

                return {
                    path: segment.path,
                    layer: layer,
                    stops: stops,
                    from: stops[0]?.name ?? "",
                    destination: stops[stops.length - 1]?.name ?? "",
                    circular: circularDetails,
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

            // Filter empty (unmatched) segments
            segmentLayers = segmentLayers.filter(
                (segment) => !!segment.destination
            );

            setSegments(segmentLayers);
            console.log("segmentLayers", segmentLayers);
            setMapMeta({
                bbox: boundingBox,
                center: mapCenter.geometry?.coordinates as Coordinates,
            });
        })();
    }, [from, destination]);

    return { segments, mapMeta };
};

export default useJourney;
