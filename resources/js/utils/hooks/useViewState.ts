import { useState } from "react";

const BREAKPOINTS = {
    XS: 320,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
};

const MAP_VIEW_STATE = {
    desktop: {
        longitude: 76.93,
        latitude: 8.51,
        zoom: 12.5,
    },
    mobile: {
        longitude: 76.9584,
        latitude: 8.485,
        zoom: 12.3,
    },
};

const isMobile = window?.innerWidth < BREAKPOINTS.MD;

const useViewState = (
    defaultViewState: Partial<typeof MAP_VIEW_STATE.desktop> = {}
) => {
    const [viewState, setViewState] = useState({
        ...MAP_VIEW_STATE[isMobile ? "mobile" : "desktop"],
        ...defaultViewState,
    });

    return [viewState, setViewState] as const;
};

export default useViewState;
