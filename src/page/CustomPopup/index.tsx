import MapBox from '@/components/MapBox';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import React, { useEffect, useState } from 'react'

const position = [120.41925654274952, 31.32994044391072]
export default function CustomPopup() {
    const [view, setView] = useState<MapView>();
    useEffect(() => {
        if (view) {
            view.popup = {
                collapseEnabled: false, // 移除title点击折叠功能
                dockOptions: {
                    buttonEnabled: false // 隐藏固定标签页
                },
                actions: [] // 清空事件按钮 （缩放至、...）
            } as any;

            view.on('click', e => {
                console.log(e);

            })
            const graphicLayer = new GraphicsLayer({ id: 'customGraphic' })
            const graphic = new Graphic({
                geometry: new Point({
                    x: position[0],
                    y: position[1]
                }),
                symbol: {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    color: [226, 119, 40],
                    outline: {
                        // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 2
                    }
                } as any,
                popupTemplate: {
                    content: () => {


                        return '231123'
                    }
                }
            })
            graphicLayer.add(graphic)
            view.map.add(graphicLayer)
        }
    }, [view]);
    return (
        <>
            <MapBox setView={setView} />
        </>
    )
}
