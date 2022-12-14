import SmallHeader from "@/Components/SmallHeader";
import React from "react";

function BasicLayout({ children }) {
    return (
        <>
            <div className="container m-auto mt-5 max-w-7xl">
                <SmallHeader />
                <main>{children}</main>
            </div>
        </>
    );
}

export default BasicLayout;
