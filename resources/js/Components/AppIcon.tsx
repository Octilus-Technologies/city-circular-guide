import React from "react";

function AppIcon({ forceDark = false }: { forceDark?: boolean }) {
    return (
        <>
            <div className="icon inline-block h-[36px] w-[36px] rounded-full bg-secondary"></div>
            <div className="name flex flex-col items-start font-bold">
                <h1
                    className={`text-xl capitalize ${
                        forceDark ? "text-primary-content" : "text-primary"
                    }`}
                >
                    City Circular Guide
                </h1>
                <span className="-mt-1 capitalize text-secondary">
                    Trivandrum
                </span>
            </div>
        </>
    );
}

export default AppIcon;
