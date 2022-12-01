import { Inertia } from "@inertiajs/inertia";
import React from "react";
import { FaCaretRight } from "react-icons/fa";

type JourneyControlProps = {
    stops: { coordinates: number[]; name: string }[];
    journey: Record<string, any>;
};

function JourneyControls({ stops, journey }: JourneyControlProps) {
    return (
        <div>
            <ul className="flex flex-wrap items-center gap-3">
                {!!stops && (
                    <li className="flex items-center gap-1">
                        {stops[0].name}
                        <span className="text-2xl">
                            <FaCaretRight />
                        </span>
                        {stops[stops.length - 1].name}
                    </li>
                )}
                {!!journey && (
                    <li>
                        {Math.round(journey.distance / 1000)} KM |{" "}
                        {Math.round(journey.duration / 60) * 1} Minutes
                    </li>
                )}
                <li>
                    <button
                        className="btn-outline btn-error btn px-5"
                        onClick={() => Inertia.visit("/")}
                    >
                        Stop
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default JourneyControls;
