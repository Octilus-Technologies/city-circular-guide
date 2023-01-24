import { Segment } from "@/utils/hooks/useJourney";
import React from "react";
import { Layer, LayerProps, Source } from "react-map-gl";

const pathLayerStyles: LayerProps = {
    type: "line",
    paint: {
        "line-width": 3,
        "line-color": "royalblue",
        "line-opacity": 0.75,
        // "line-dasharray": [1, 2],
    },
};

function SegmentLayer({ segment, id }: { segment: Segment; id: number }) {
    const layerStyles = { ...pathLayerStyles };

    if (layerStyles.type == "line" && segment.path?.profile === "walking") {
        layerStyles.paint = {
            ...layerStyles.paint,
            "line-dasharray": [1, 0.5],
        };
    }

    if (segment?.circular?.color && layerStyles.type == "line") {
        layerStyles.paint = {
            ...layerStyles.paint,
            "line-color": segment.circular.color,
        };
    }

    return (
        <Source
            id={`path-data-${id}`}
            type="geojson"
            data={segment.path?.geometry as any}
        >
            <Layer {...layerStyles} id={`path-${id}-line`} />
        </Source>
    );
}

export default SegmentLayer;
