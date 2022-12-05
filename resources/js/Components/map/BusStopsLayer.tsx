import React from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";

type CircleLayerProps = Extract<LayerProps, { type: "circle" }>;

type BusStopLayerProps = {
    layerProps?: Partial<CircleLayerProps>;
} & SourceProps;

const defaultLayerProps: CircleLayerProps = {
    id: "point",
    type: "circle",
    paint: {
        "circle-radius": 8,
        "circle-color": "black",
    },
};

function BusStopsLayer(props: BusStopLayerProps) {
    const { layerProps, ...sourceProps } = props;
    const combinedLayerProps = {
        ...defaultLayerProps,
        ...layerProps,
    };

    return (
        <Source {...sourceProps}>
            <Layer {...combinedLayerProps} />
        </Source>
    );
}

export default BusStopsLayer;
