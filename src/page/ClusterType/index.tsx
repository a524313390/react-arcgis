import MapBox from '@/components/MapBox';
import MapView from '@arcgis/core/views/MapView';
import React, { useEffect, useState } from 'react'
import * as turf from '@turf/turf'
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as clusterLabelCreator from "@arcgis/core/smartMapping/labels/clusters";
const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
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
export default function ClusterType() {
    const [view, setView] = useState<MapView>();
    useEffect(() => {
        if (view) {

            var points = turf.randomPoint(100, { bbox: [121.76073295524006, 30.79371234139185, 119.51814872672357, 31.30549880284,] }) as any;
            let features: any[] = [];
            console.log(points);
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

                        },
                    },
                )
            })
            let layer = new FeatureLayer({
                source: features,  // autocast as a Collection of new Graphic()
                objectIdField: "ObjectID",
                // featureReduction: clusterConfig as any,
                renderer: {
                    type: "simple",
                    field: "mag",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: "#69dcff",
                        outline: {
                            color: "rgba(0, 139, 174, 0.5)",
                            width: 5
                        }
                    }
                } as any,
            });
            layer.when().then(async layers => {
                const {
                    labelingInfo,
                    clusterMinSize
                } = await clusterLabelCreator
                    .getLabelSchemes({ layer, view })
                    .then((labelSchemes) => labelSchemes.primaryScheme);

                let clusterConfig: any = {
                    type: "cluster",

                    labelingInfo,
                    clusterMinSize
                };
                layer.featureReduction = clusterConfig;
            })
            view.map.add(layer)


        }
    }, [view]);
    useEffect(() => {
        // var position = turf.randomPosition([-180, -90, 180, 90])

    }, []);
    return (
        <>
            <MapBox setView={setView} />
        </>
    )
}
