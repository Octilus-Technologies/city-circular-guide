import SmallHeader from "@/Components/SmallHeader";
import React, { ReactNode } from "react";

function BasicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <SmallHeader />

            <div className="container m-auto mt-5 max-w-7xl">
                <main>{children}</main>
            </div>
        </>
    );
}

export default BasicLayout;
