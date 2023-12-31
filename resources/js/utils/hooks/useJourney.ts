import {
    Coordinates,
    generateLayerFromGeometry as generateLayer,
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
    layer: ReturnType<typeof generateLayer>;
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

            const promises = stopSegments.map((segment) =>
                getMatch(
                    mapAccessToken,
                    segment.stops.map((s) => s.coordinates),
                    segment.profile
                )
            );
            const pathSegments: {
                path?: Path;
            }[] = (await Promise.all(promises)).map((path) => ({ path }));

            const segmentLayers: Segment[] = pathSegments.map((segment, i) => {
                const stopSegment = stopSegments[i];
                const circular = stopSegment?.circular;
                const isDriving = segment.path?.profile == "driving";
                const stops = isDriving
                    ? getStopDetails(
                          stopSegment.stops.map((s) => s.coordinates),
                          circular?.name,
                          circular?.isClockwise
                      )
                    : [];
                const layer = generateLayer(segment?.path?.geometry);
                const circularDetails = circular
                    ? getCircularDetails(circular.name, circular.isClockwise)
                    : undefined;

                return {
                    path: segment.path,
                    layer: layer,
                    stops: stops,
                    from: stops[0]?.name,
                    destination: stops[stops.length - 1]?.name,
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
                .flatMap((s) => s.layer?.features?.[0].geometry?.coordinates)
                .filter((c) => !!c);
            const boundingBox = bbox(lineString(allCoordinates as any));
            const mapCenter = center(lineString(allCoordinates as any));

            // Filter empty (unmatched) segments
            const filteredSegments = segmentLayers.filter((s) => !!s.path);
            console.log("filteredSegments", filteredSegments);

            setSegments(filteredSegments);
            setMapMeta({
                bbox: boundingBox,
                center: mapCenter.geometry?.coordinates as Coordinates,
            });
        })();
    }, [from, destination]);

    return { segments, mapMeta };
};

export default useJourney;
