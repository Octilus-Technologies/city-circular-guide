import { Segment } from "@/utils/hooks/useJourney";
import { Inertia } from "@inertiajs/inertia";
import { GeometryObject } from "@turf/turf";
import React, { Fragment } from "react";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import JourneySteps from "./JourneySteps";
import WalkSteps from "./WalkSteps";

type JourneyControlProps = {
    expanded?: boolean;
    segments: Segment[];
    journey?: JourneyDTO;
};

export interface JourneyDetails {
    via_waypoints: Record<string, any>[];
    admins: Record<string, any>[];
    weight: number;
    duration: number;
    steps: Step[];
    distance: number;
    summary: string;
}

interface Step {
    intersections: Record<string, any>[];
    maneuver: Maneuver;
    name: string;
    duration: number;
    distance: number;
    driving_side: string;
    weight: number;
    mode: string;
    geometry: GeometryObject;
    ref?: string;
}

interface Maneuver {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
    location: number[];
    modifier?: string;
    exit?: number;
}

function JourneyControls({
    segments,
    journey,
    expanded = true,
}: JourneyControlProps) {
    const from = journey?.from;
    const destination = journey?.destination;

    return (
        <div className="flex flex-col items-start gap-3">
            <div className="align-center relative flex w-full justify-between pt-4 pb-2 text-sm font-bold">
                <span className="flex w-[25%] items-center justify-center gap-1">
                    <FaMapMarkerAlt className="mr-1 inline-block flex-shrink-0 text-xl text-secondary" />
                    {(from?.name as string).split(",")[0]}
                </span>

                <div className="relative mx-4 flex flex-1 items-center justify-center">
                    <span className="absolute top-[50%] left-0 right-0 -z-[1] translate-y-[-50%] border-0 border-t-2 border-dashed opacity-40"></span>
                    <span className="grid h-[30px] w-[30px] place-content-center rounded-full bg-secondary text-primary shadow-lg">
                        to
                    </span>
                </div>

                <span className="flex w-[25%] items-center justify-center gap-1">
                    <FaFlag className="mr-1 inline-block flex-shrink-0 text-xl text-secondary" />
                    {(destination?.name as string).split(",")[0]}
                </span>
            </div>

            <hr className="mb-4 w-full bg-white opacity-50" />

            <ul className="flex w-full flex-col gap-5">
                {segments.map((segment, i) => {
                    const isLastSegment = i === segments.length - 1;

                    return (
                        <Fragment key={`segment-${i}`}>
                            <li className="flex w-full flex-col items-start">
                                {segment.path?.profile === "driving" && (
                                    <JourneySteps
                                        segment={segment}
                                        expanded={true}
                                    />
                                )}

                                {/* modify data so that each segment have a from and destination */}
                                {segment.path?.profile === "walking" && (
                                    <WalkSteps
                                        segment={segment}
                                        expanded={true}
                                    />
                                )}
                            </li>

                            {!isLastSegment && !!segment.path && (
                                <span className="h-[3px] bg-primary" />
                            )}
                        </Fragment>
                    );
                })}
            </ul>

            <button
                className="btn-outline btn-error btn mt-3 w-full px-5"
                onClick={() => Inertia.visit("/")}
            >
                Stop Journey
            </button>
        </div>
    );
}

export default JourneyControls;
