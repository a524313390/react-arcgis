import MapBox from '@/components/MapBox';
import MapView from '@arcgis/core/views/MapView';
import React, { useEffect, useState } from 'react'
import * as turf from '@turf/turf'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
const renderer = {
    type: "heatmap",
    colorStops: [
        { color: "rgba(63, 40, 102, 0)", ratio: 0 },
        { color: "#472b77", ratio: 0.083 },
        { color: "#4e2d87", ratio: 0.166 },
        { color: "#563098", ratio: 0.249 },
        { color: "#5d32a8", ratio: 0.332 },
        { color: "#6735be", ratio: 0.415 },
        { color: "#7139d4", ratio: 0.498 },
        { color: "#7b3ce9", ratio: 0.581 },
        { color: "#853fff", ratio: 0.664 },
        { color: "#a46fbf", ratio: 0.747 },
        { color: "#c29f80", ratio: 0.83 },
        { color: "#e0cf40", ratio: 0.913 },
        { color: "#ffff00", ratio: 1 }
    ],
    maxPixelIntensity: 25,
    minPixelIntensity: 0
};
export default function Heat() {
    const [view, setView] = useState<MapView>();
    useEffect(() => {
        if (view) {
            var points = turf.randomPoint(100, { bbox: [121.76073295524006, 30.79371234139185, 119.51814872672357, 31.30549880284,] }) as any;
            let features: any[] = [];
            console.log(points);

            points.features.forEach((item: any, index: number) => {
                const { geometry } = item;
                const { coordinates } = geometry
                features.push(
                    {
                        geometry: {
                            type: "point",
                            x: coordinates[0],
                            y: coordinates[1],

                        },
                        attributes: {
                            ObjectID: index,

                        },
                    },
                )
            })

            console.log(features);

            let layer = new FeatureLayer({
                fields: ["*"],
                source: features,
                renderer: renderer as any,
                objectIdField: "ObjectID",


            });
            console.log(layer);

            view.map.add(layer)


        }
    }, [view]);
    return (
        <>
            <MapBox setView={setView} />
        </>
    )
}
