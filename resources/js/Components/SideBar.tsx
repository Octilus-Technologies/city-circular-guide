import SmallHeader from "@/Components/SmallHeader";
import React from "react";

function SideBar({ children }: { children: React.ReactNode }) {
    return (
        <section
            className="actions fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-2
            rounded-t-3xl bg-primary bg-opacity-80
            p-5 text-center backdrop-blur-md md:absolute md:top-0
             md:right-auto md:max-w-[600px] md:flex-col md:gap-5 md:rounded-none"
        >
            <span className="m-auto inline-block min-h-[6px] w-[20vw] rounded-xl bg-primary-content opacity-20 md:mb-4 md:hidden"></span>

            <SmallHeader forceDark={true} />

            <div className="h-full max-h-[50vh] overflow-auto scrollbar-thin scrollbar-thumb-primary md:max-h-full">
                {children}
            </div>
        </section>
    );
}

export default SideBar;
