import { baseLayer } from '@/config';
import TileLayer from '@arcgis/core/layers/TileLayer';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map'
import { Space, Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import BaseMap from '@arcgis/core/Basemap'
import Point from '@arcgis/core/geometry/Point';
import SceneView from '@arcgis/core/views/SceneView'


export default function MapToggle() {
    const [type, setType] = useState('2d');
    const [view, setView] = useState<MapView | SceneView>()
    const [map, setMap] = useState<Map>()
    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
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
        setMap(map)
    }, []);
    useEffect(() => {
        if (map) {
            if (type === '2d') {
                const view = new MapView({
                    map,
                    container: mapRef.current as HTMLDivElement,
                    zoom: 10,
                    center: new Point({
                        x: 120.64012748649165,
                        y: 31.049361337243045,

                    }),

                })
                view.ui.components = []
                console.log(view.map.basemap.loadStatus);

                setView(view)
            } else {
                const viewpoint = view?.viewpoint.clone();
                const sceneView = new SceneView({
                    scale: 123456789,
                    map: map
                });
                sceneView.set({
                    container: mapRef.current as HTMLDivElement,
                    viewpoint: viewpoint
                })
                sceneView.ui.components = []
                setView(sceneView)
            }
        }
    }, [type, map]);
    const switchView = () => {
        if (!view) return;
        if (view.type === '2d') {
            setType('3d')

        } else {
            setType('2d')
        }

    }
    return (
        <>
            <Space>
                <Button type="primary" onClick={switchView}>切换{type === '2d' ? "三维" : "二维"}</Button>
            </Space>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        </>
    )
}
