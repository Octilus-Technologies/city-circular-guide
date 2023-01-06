import { BusStopDetail } from "@/utils/geoJson";
import React, { CSSProperties } from "react";
import { MdDirectionsBus } from "react-icons/md";

function BusStopInfo({ stop }: { stop: BusStopDetail }) {
    const infoColor =
        stop?.circulars.length == 1 ? stop.circulars[0].color : null;
    const rootStyles = {
        "--circular-info-color": infoColor ?? "hsl(var(--pf))",
    } as CSSProperties;

    return (
        <div className="flex flex-col items-center gap-1" style={rootStyles}>
            <div className="bus-info flex w-full items-stretch justify-around overflow-hidden rounded-md text-white">
                <div className="icon border-base bordered grid place-content-center border-r-[1px] bg-[var(--circular-info-color)] px-2">
                    <MdDirectionsBus className="inline-block text-6xl" />
                </div>
                <div className="align-center flex flex-1 flex-col items-center bg-[var(--circular-info-color)] p-2 text-2xl font-bold">
                    <span>112</span>
                    <span>C</span>
                    {/* TODO: fetch dynamic data */}
                </div>
            </div>

            <div className="stop-info flex flex-col items-stretch justify-center gap-1 text-center">
                <div className="text-lg font-[800] uppercase text-[var(--circular-info-color)]">
                    Bus Stop
                </div>
                <div className="name name-en rounded-md bg-[var(--circular-info-color)] px-4 text-lg font-bold uppercase text-white">
                    {stop.name}
                </div>
                <div className="name name-locale rounded-md px-4 text-[1rem] font-bold uppercase text-[var(--circular-info-color)]">
                    {stop.nameLocale}
                </div>

                {stop.circulars.length > 1 && (
                    <div className="interchange">
                        <div className="name rounded-md bg-[var(--circular-info-color)] px-4 text-sm tracking-wider text-white">
                            Interchange
                        </div>
                        <div className="interchange-icons -space-x-[0.4rem] pt-2 saturate-150">
                            {stop.circulars.map((circular) => (
                                <span
                                    key={circular.name}
                                    title={`${circular.name} circular`}
                                    className="bordered inline-block aspect-square w-[1rem] rounded-full border-[3px] opacity-80"
                                    style={{
                                        borderColor: circular.color,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusStopInfo;
