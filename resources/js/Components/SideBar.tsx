import React from "react";
import SmallHeader from "./SmallHeader";

function SideBar({ children }: { children: React.ReactNode }) {
    return (
        <section
            className="actions absolute bottom-0 left-0 right-0 z-50 flex
            max-h-[60vh] flex-col gap-2 overflow-auto rounded-t-3xl bg-primary
            bg-opacity-90 p-5 text-center backdrop-blur-md md:top-0
            md:right-auto md:max-h-full md:flex-col md:gap-5 md:rounded-none"
        >
            <span className="m-auto mb-4 inline-block min-h-[6px] w-[20vw] rounded-xl bg-primary-content opacity-20 md:hidden"></span>

            <SmallHeader />

            {children}
        </section>
    );
}

export default SideBar;