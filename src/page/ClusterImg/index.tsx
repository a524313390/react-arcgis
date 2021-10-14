import MapBox from '@/components/MapBox';
import MapView from '@arcgis/core/views/MapView';
import React, { useEffect, useState } from 'react'
import * as turf from '@turf/turf'
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as clusterLabelCreator from "@arcgis/core/smartMapping/labels/clusters";
import tl_lxjk from "./images/tl_lxjk.png";
import tl_zxjk from "./images/tl_zxjk.png";
import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer";
const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster

    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [
        {
            deconflictionStrategy: "none",
            labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
            },
            symbol: {
                type: "text",
                color: "#004a5d",
                font: {
                    weight: "bold",
                    family: "Noto Sans",
                    size: "12px"
                }
            },
            labelPlacement: "center-center"
        }
    ]
};
const markerSymbol_offline = {
    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
    url: tl_lxjk,
    width: "23px",
    height: "23px",
};
const markerSymbol_online = {
    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
    url: tl_zxjk,
    width: "23px",
    height: "23px",
};
const render: any = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    field: "type",
    uniqueValueInfos: [
        {
            value: "red", // code for interstates/freeways
            symbol: markerSymbol_offline,
            label: "离线",
        },
        {
            value: "green", // code for U.S. highways
            symbol: markerSymbol_online,
            label: "在线",
        },
    ],
}
export default function Cluster() {
    const [view, setView] = useState<MapView>();
    useEffect(() => {
        if (view) {

            var points = turf.randomPoint(100, { bbox: [121.76073295524006, 30.79371234139185, 119.51814872672357, 31.30549880284,] }) as any;
            let features: any[] = [];

            points.features.forEach((item: any, index: number) => {
                const { geometry } = item;
                const { coordinates, type } = geometry
                features.push(
                    {
                        geometry: {
                            type: "point",
                            x: coordinates[0],
                            y: coordinates[1]
                        },
                        attributes: {
                            ObjectID: index,
                            type: (index & 2) == 0 ? 'red' : 'green'
                        },
                    },
                )


            })
            console.log(points);

            let layer = new FeatureLayer({
                source: features,
                objectIdField: "ObjectID",
                featureReduction: clusterConfig as any,
                renderer: render,
                fields: [
                    {
                        name: "ObjectID",
                        type: "string",
                    },
                    {
                        name: "type",
                        type: "string",
                    },

                ],
            });

            view.map.add(layer)


        }
    }, [view]);

    return (
        <>
            <MapBox setView={setView} />
        </>
    )
}
