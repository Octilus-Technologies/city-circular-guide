import CircularIcon from "@/Components/Icons/CircularIcon";
import { BusStopDetail } from "@/utils/geoJson";
import React, { CSSProperties } from "react";
import { MdDirectionsBus } from "react-icons/md";

function BusStopInfo({ stop }: { stop: BusStopDetail }) {
    const clockwiseCirculars = stop.circulars.filter(
        (circular) => circular.isClockwise
    );
    const anticlockwiseCirculars = stop.circulars.filter(
        (circular) => !circular.isClockwise
    );

    const infoColor =
        (clockwiseCirculars.length == 1 ? clockwiseCirculars[0].color : null) ??
        "hsl(var(--pf))";

    const rootStyles = {
        "--circular-info-color": infoColor,
    } as CSSProperties;

    return (
        <div className="flex flex-col items-center gap-1" style={rootStyles}>
            <div className="bus-info flex w-full items-stretch justify-around overflow-hidden rounded-md text-white">
                <div className="icon border-base bordered grid place-content-center border-r-[1px] bg-[var(--circular-info-color)] p-2">
                    <MdDirectionsBus className="inline-block text-6xl" />
                </div>
                <div className="clockwise flex w-full flex-col items-center justify-center gap-3 bg-[var(--circular-info-color)] p-3">
                    <div className="flex justify-center gap-3 text-xl font-bold">
                        {clockwiseCirculars?.map((circular, i) => (
                            <span
                                key={circular.id}
                                style={{
                                    borderColor: circular.color,
                                }}
                                className="border-b-2 text-center"
                            >
                                {circular.id}
                            </span>
                        ))}
                    </div>
                    <div className="anti-clockwise flex justify-center gap-3 text-xl font-bold">
                        {anticlockwiseCirculars?.map((circular, i) => (
                            <span
                                key={circular.id}
                                style={{
                                    borderColor: circular.color,
                                }}
                                className="border-b-2 text-center"
                            >
                                {circular.id}
                            </span>
                        ))}
                    </div>
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

                {clockwiseCirculars.length > 1 && (
                    <div className="interchange">
                        <div className="name rounded-md bg-[var(--circular-info-color)] px-4 text-sm tracking-wider text-white">
                            Interchange
                        </div>
                        <div className="interchange-icons -space-x-[0.4rem] pt-2 saturate-150">
                            {clockwiseCirculars.map(
                                (circular) =>
                                    !!circular && (
                                        <CircularIcon
                                            name={circular.name}
                                            color={circular.color ?? infoColor}
                                        />
                                    )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusStopInfo;
