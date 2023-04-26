import SmallHeader from "@/Components/SmallHeader";
import React from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

type SideBarProps = {
    children: React.ReactNode;
    toggleExpanded?: () => void;
    expanded: boolean;
};

function SideBar({
    children,
    toggleExpanded,
    expanded,
}: SideBarProps) {
    return (
        <section
            className="actions fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-1
            rounded-t-3xl bg-primary bg-opacity-80
            p-5 text-center backdrop-blur-md md:absolute md:top-0
             md:right-auto md:max-w-[600px] md:flex-col md:gap-5 md:rounded-none"
        >
            <button
                className="m-auto inline-block md:mb-4 md:hidden text-base-100"
            >
                <label className="swap">
                    <input checked={expanded} type="checkbox" onChange={toggleExpanded} className="hidden" />

                    <SlArrowUp className="swap-off" />
                    <SlArrowDown className="swap-on" />
                </label>
            </button>

            <SmallHeader forceDark={true} />

            <div className="h-full max-h-[50vh] overflow-auto scrollbar-thin scrollbar-thumb-primary md:max-h-full">
                {children}
            </div>
        </section>
    );
}

export default SideBar;
