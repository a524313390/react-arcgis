import Map from '@arcgis/core/Map'
import { baseLayer } from '@/config';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import MapView from '@arcgis/core/views/MapView';

import React, { useEffect, useState } from 'react'
import './index.less'
export default function ManyScreen() {
    const [view, setView] = useState<MapView>();
    if (view) {
        view.watch(['extent'], e => {
            console.log(e);

        })
    }
    useEffect(() => {
        const basemap = new Basemap({
            baseLayers: [
                new TileLayer({
                    url: baseLayer[0].url,
                    title: 'Basemap',
                }),
            ],
            title: 'basemap',
            id: 'basemap',
        });
        const map1 = new Map({
            basemap
        })
        const map2 = new Map({
            basemap
        })
        const map3 = new Map({
            basemap
        })
        const map4 = new Map({
            basemap
        })
        const view1 = new MapView({
            container: 'many1',
            map: map1,
            zoom: 10,
            center: [104.072745, 30.663774],
        })
        const view2 = new MapView({
            container: 'many2',
            map: map2,
            zoom: 10,
            center: [104.072745, 30.663774],
        })
        const view3 = new MapView({
            container: 'many3',
            map: map3,
            zoom: 10,
            center: [104.072745, 30.663774],
        })
        const view4 = new MapView({
            container: 'many4',
            map: map4,
            zoom: 10,
            center: [104.072745, 30.663774],
        })
        view1.ui.components = []
        view2.ui.components = []
        view3.ui.components = []
        view4.ui.components = []
        view1.watch(['extent', 'rotation'], (e) => {
            console.log(e);
            if (view1.center) {
                view2.goTo({
                    center: [view1.center.longitude, view1.center.latitude],
                    zoom: view1.zoom,
                });
                view3.goTo({
                    center: [view1.center.longitude, view1.center.latitude],
                    zoom: view1.zoom,
                });
                view4.goTo({
                    center: [view1.center.longitude, view1.center.latitude],
                    zoom: view1.zoom,
                });
            }
            //可以通过这个限制地图范围
            if (view1.extent) {
                console.log(
                    '2',
                    view1.extent.xmin.toFixed(2),
                    view1.extent.xmax.toFixed(2),
                    view1.extent.ymin.toFixed(2),
                    view1.extent.ymax.toFixed(2),
                );
            }
        });
    }, []);
    return (
        <div className='many-screen'>
            <div className="many1  many-item" id="many1"></div>
            <div className="many2  many-item" id="many2"></div>
            <div className="many3  many-item" id="many3"></div>
            <div className="many4  many-item" id="many4"></div>
        </div>
    )
}
