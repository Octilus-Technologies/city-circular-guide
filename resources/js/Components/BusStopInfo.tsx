import { getStopDetails } from "@/utils/geoJson";
import React from "react";
import { MdDirectionsBus } from "react-icons/md";

function BusStopInfo({
    stop,
}: {
    stop: ReturnType<typeof getStopDetails>[number];
}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="bus-info flex w-full items-stretch justify-around overflow-hidden rounded-md text-white">
                <div
                    className="icon border-base bordered grid place-content-center border-r-[1px] bg-primary px-2"
                    style={{ backgroundColor: stop.circular.color }}
                >
                    <MdDirectionsBus className="inline-block text-6xl" />
                </div>
                <div
                    className="align-center flex flex-1 flex-col items-center bg-primary p-2 text-2xl font-bold"
                    style={{ backgroundColor: stop.circular.color }}
                >
                    <span>112</span>
                    <span>C</span>
                </div>
            </div>

            <div className="stop-info flex flex-col items-stretch justify-center gap-1 text-center">
                <div
                    className="text-lg font-[800] uppercase text-primary"
                    style={{ color: stop.circular.color }}
                >
                    Bus Stop
                </div>
                <div
                    className="name name-en rounded-md bg-primary px-4 text-lg font-bold uppercase text-white"
                    style={{ backgroundColor: stop.circular.color }}
                >
                    {stop.name}
                </div>
                <div
                    className="name name-locale rounded-md px-4 text-[1rem] font-bold uppercase text-primary"
                    style={{ color: stop.circular.color }}
                >
                    കേശവദാസപുരം
                </div>

                {!!stop.isJunction && (
                    <div className="interchange">
                        <div
                            className="name rounded-md bg-primary px-4 text-sm tracking-wider text-white"
                            style={{ backgroundColor: stop.circular.color }}
                        >
                            Interchange
                        </div>
                        <div className="interchange-icons -space-x-[0.4rem] pt-2 saturate-150">
                            <span
                                className="bordered inline-block h-[1rem] w-[1rem] rounded-full border-[3px] border-primary opacity-80"
                                style={{ borderColor: stop.circular.color }}
                            />
                            <span className="bordered inline-block h-[1rem] w-[1rem] rounded-full border-[3px] border-secondary opacity-80" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusStopInfo;
