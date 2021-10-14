import React, { useEffect, useRef } from 'react'
import Map from '@arcgis/core/Map'
import BaseMap from '@arcgis/core/Basemap'
import MapView from "@arcgis/core/views/MapView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import './index.less'
import { ArcGISOptions, baseLayer, dev } from '@/config';
import * as urlUtils from '@arcgis/core/core/urlUtils';
import Point from '@arcgis/core/geometry/Point';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
interface Props {
    setView?: Function
}
export default function MapBox(props: Props) {
    const { setView } = props;
    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        //午夜蓝
        if (dev) {
            urlUtils.addProxyRule({
                urlPrefix: 'http://172.16.9.114:6080',
                proxyUrl: ArcGISOptions.proxy
            });
        }
        const baseLayerArr: TileLayer[] = []


        baseLayer.forEach(item => {
            const { url, id, visible } = item;
            const baseLayer = new TileLayer({
                url,
                visible,
                id
            })
            baseLayerArr.push(baseLayer)
        })


        const basemap = new BaseMap({
            baseLayers: baseLayerArr
        })
        const map = new Map({
            basemap,

        })
        const view = new MapView({
            map,
            container: mapRef.current as HTMLDivElement,
            zoom: 10,
            center: new Point({
                x: 120.64012748649165,
                y: 31.049361337243045,

            }),

        })
        view.ui.remove('zoom')
        view.ui.remove('attribution')
        setView && setView(view)
    }, []);
    return (
        <div className='map-box' ref={mapRef}>

        </div>
    )
}
