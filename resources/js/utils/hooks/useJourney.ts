import { getOptimizedStops } from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import { BBox, bbox, center, lineString } from "@turf/turf";
import { useEffect, useState } from "react";
import { generateLayerFromGeometry, getStopDetails } from "../geoJson";
import { Coordinates } from "./../geoJson";
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
            const segments: {
                stops: Coordinates[];
                profile: Profile;
            }[] = getOptimizedStops(from.coords, destination.coords).map(
                (stops) => ({
                    stops,
                    profile: "driving",
                })
            );
            if (!segments || !segments.length) {
                return console.log("Unable to find a route");
            }

            segments.unshift({
                stops: [from.coords, segments[0].stops[0]],
                profile: "walking",
            });
            const lastSegment = segments[segments.length - 1];
            segments.push({
                stops: [
                    lastSegment.stops[lastSegment.stops.length - 1],
                    destination.coords,
                ],
                profile: "walking",
            });
            // console.log("segments", segments);

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

                return {
                    path: segment.path ?? undefined,
                    layer: generateLayerFromGeometry(segment?.path?.geometry),
                    stops: stops,
                    from: stops[0]?.name ?? "",
                    destination: stops[stops.length - 1]?.name ?? "",
                };
            });

            // Hydrate walking segments
            segmentLayers.forEach((segment, i) => {
                if (segment.path?.profile == "walking") {
                    segment.from = segmentLayers[i - 1]
                        ? segmentLayers[i - 1].destination + " stop"
                        : from.name.split(",")[0];
                    segment.destination = segmentLayers[i + 1]
                        ? segmentLayers[i + 1].from + " stop"
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
