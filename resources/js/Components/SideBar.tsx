import SmallHeader from "@/Components/SmallHeader";
import React from "react";

function SideBar({ children }: { children: React.ReactNode }) {
    return (
        <section
            className="actions fixed md:absolute bottom-0 left-0 right-0 z-50 flex
            flex-col gap-2 rounded-t-3xl bg-primary bg-opacity-80
            p-5 text-center backdrop-blur-md md:top-0 md:right-auto
             md:max-w-[600px] md:flex-col md:gap-5 md:rounded-none"
        >
            <span className="m-auto md:mb-4 inline-block min-h-[6px] w-[20vw] rounded-xl bg-primary-content opacity-20 md:hidden"></span>

            <SmallHeader forceDark={true} />

            <div className="max-h-[50vh] md:max-h-full overflow-auto">
                {children}
            </div>
        </section>
    );
}

export default SideBar;
