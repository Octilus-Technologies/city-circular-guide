import React from "react";

type JourneyControlProps = {
    stops: { coordinates: number[]; name: string }[];
    journey: Record<string, any>;
    onStop: () => void;
};

function JourneyControls({ stops, journey, onStop }: JourneyControlProps) {
    return (
        <div>
            <ul className="flex flex-wrap items-center gap-3">
                {!!stops && (
                    <li>
                        {stops[0].name} ➡️ {stops[stops.length - 1].name}
                    </li>
                )}
                <li>
                    {Math.round(journey.distance / 100)} KM |{" "}
                    {Math.round(journey.duration / 60) * 2} Minutes
                </li>
                <li>
                    <button className="btn-primary btn px-5">Stop</button>
                </li>
            </ul>
        </div>
    );
}

export default JourneyControls;
