import React, { HTMLAttributes } from "react";

function CircularIcon({
    name,
    color,
    className = "",
    ...props
}: {
    name: string;
    color: string;
    className?: string;
} & HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            title={`${name} circular`}
            className={`bordered inline-block aspect-square w-[1rem] rounded-full border-[3px] opacity-80 ${className}`}
            style={{
                borderColor: color,
            }}
            {...props}
        />
    );
}

export default CircularIcon;
