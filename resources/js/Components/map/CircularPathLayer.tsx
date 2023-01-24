import { CircularData } from "@/utils/hooks/useCirculars";
import React from "react";
import { Layer, LayerProps, Source } from "react-map-gl";

const pathLayerStyles: LayerProps & Record<string, any> = {
    type: "line",
    paint: {
        "line-width": 3,
        "line-color": "royalblue",
        "line-opacity": 0.5,
        // "line-dasharray": [1, 2],
    },
};

function CircularPathLayer({ circular }: { circular: CircularData }) {
    const layerStyles = { ...pathLayerStyles };

    if (circular.color && layerStyles) {
        layerStyles.paint = {
            ...layerStyles.paint,
            "line-color": circular.color,
        };
    }

    return (
        <Source
            id={`path-data-${circular.id}`}
            type="geojson"
            data={circular.path as any}
        >
            <Layer {...layerStyles} id={`path-${circular.id}-line`} />
        </Source>
    );
}

export default CircularPathLayer;
