import { getOptimizedStops } from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import { BBox, bbox, center, lineString } from "@turf/turf";
import { useEffect, useState } from "react";
import { generateLayerFromGeometry, getStopDetails } from "../geoJson";
import { Coordinates } from "./../geoJson";
import { Profile } from "./../mapbox-api";

export type Segment = {
    layer: ReturnType<typeof generateLayerFromGeometry>;
    stops: ReturnType<typeof getStopDetails>;
    path?: Awaited<ReturnType<typeof getMatch>>;
    profile: Profile;
};

const useJourney = (
    mapAccessToken: string,
    from: Coordinates,
    destination: Coordinates
) => {
    const [segments, setSegments] = useState<Segment[]>();
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
            const segmentPath: {
                path?: Awaited<ReturnType<typeof getMatch>>;
                profile: Profile;
            }[] = (await Promise.all(segmentPathPromises)).map((path) => ({
                path: path,
                profile: "driving",
            }));

            // Add walking path
            segments.unshift([from, segments[0][0]]);
            const walk1 = await getMatch(
                mapAccessToken,
                segments[0],
                "walking"
            );
            segmentPath.unshift({
                path: walk1,
                profile: "walking",
            });

            segments.push([
                segments[segments.length - 1][
                    segments[segments.length - 1].length - 1
                ],
                destination,
            ]);
            const walk2 = await getMatch(
                mapAccessToken,
                segments[segments.length - 1],
                "walking"
            );
            segmentPath.push({
                path: walk2,
                profile: "walking",
            });
            // TODO: may have waling path in between bus route segments

            const segmentLayers = segmentPath.map((segment, i) => ({
                path: segment.path ?? undefined,
                profile: segment.profile,
                layer: generateLayerFromGeometry(segment?.path?.geometry),
                stops:
                    segment.profile == "driving" && segments[i]
                        ? getStopDetails(segments[i])
                        : [],
            }));

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
