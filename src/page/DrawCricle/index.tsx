import MapBox from '@/components/MapBox';
import Circle from '@arcgis/core/geometry/Circle';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import React, { useEffect, useRef, useState } from 'react';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';
import Polyline from '@arcgis/core/geometry/Polyline';
import Draw from '@arcgis/core/views/draw/Draw';
const color = [226, 119, 40];
const fillSymbol = {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    color: 'transparent',
    outline: {
        // autocasts as new SimpleLineSymbol()
        color,
        width: 4,
    },
};

const pointMarker = {
    type: 'simple-marker',
    color: 'red',
    outline: {
        color,
        width: 1,
    },
};
const lineSymbol = {
    type: 'simple-line', // autocasts as SimpleLineSymbol()
    color: [226, 119, 40],
    width: 4,
};
const spatialReference = new SpatialReference({ wkid: 102100 });
export default function DrawCricle() {
    const [view, setView] = useState<MapView>();
    const [circle, setCircle] = useState({
        point: new Point({ latitude: 31.082886544520797, longitude: 120.76578361441936, spatialReference }),
        rightPoint: null,
        radius: 1000,
    });
    const [centertGraphic] = useState(new GraphicsLayer({ id: 'centertGraphic' }));
    const [dragLayer] = useState(new GraphicsLayer({ id: 'circledragLayer' }));
    const [circleLayer] = useState(new GraphicsLayer({ id: 'circleLayer' }));
    const isDrag = useRef<boolean>(false);
    const clickRef = useRef<IHandle | null>();
    const moveRef = useRef<IHandle | null>();
    useEffect(() => {
        if (view && circle.rightPoint) {
            centertGraphic.removeAll();
            circleLayer.removeAll();
            dragLayer.removeAll();
            createCircle();
        }
    }, [circle]);
    //绘制半径
    const addLine = (paths: any) => {
        let line = new Polyline({
            paths: paths,
        });
        const graphic = new Graphic({
            geometry: line,
            symbol: lineSymbol,
        });
        circleLayer.add(graphic);
    };
    //绘制点
    const addPoint = (point: Point, layer: GraphicsLayer) => {
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: pointMarker,
        });
        layer.add(pointGraphic);
    };

    const clickHandle = (event: any) => {
        if (!view) return;
        const { button } = event;

        view.hitTest(event, { include: [dragLayer] }).then(response => {
            if (response.results.length > 0) {
                const graphic = response.results[0];

                if (graphic && button == 0) {
                    isDrag.current = true;
                    moveRef.current = view.on('pointer-move', moveHandle);
                } else {
                    isDrag.current = false;
                }
            }
        });
    };

    const moveHandle = async (event: any) => {
        if (!isDrag.current) return;

        const position: any = view?.toMap(event);

        const { latitude, longitude } = position;
        const currentPoint = new Point({ latitude, longitude, spatialReference });

        //根据移动的点算出半径
        const distance = circle.point.distance(currentPoint);

        setCircle({
            ...circle,
            radius: distance,
            rightPoint: currentPoint as any,
        });
    };

    const createCircle = () => {
        //圆
        const geometry = new Circle({ center: circle.point, radius: circle.radius, radiusUnit: 'meters' });
        const circleGraphic = new Graphic({
            geometry,
            symbol: fillSymbol,
        });
        circleLayer.addMany([circleGraphic]);
        addPoint(circle.point, circleLayer);
        if (!circle.rightPoint) {
            //转为墨卡托投影然后加上半径就是新的坐标
            const pro = webMercatorUtils.lngLatToXY(circle.point.longitude, circle.point.latitude);
            const x2 = pro[0] + circle.radius;
            const y2 = pro[1];
            //墨卡托转经纬度
            const geo = webMercatorUtils.xyToLngLat(x2, y2);
            const point = new Point({ latitude: geo[1], longitude: geo[0] });
            //绘制园右侧点用来拖动
            addPoint(point, dragLayer);
            //绘制半径
            const paths = [
                [circle.point.longitude, circle.point.latitude],
                [geo[0], geo[1]],
            ];
            addLine(paths);
        } else {
            //绘制园右侧点用来拖动
            addPoint(circle.rightPoint, dragLayer);
            //绘制半径
            const paths = [
                [circle.point.longitude, circle.point.latitude],
                [(circle.rightPoint as any).longitude, (circle.rightPoint as any).latitude],
            ];
            addLine(paths);
        }
    };
    useEffect(() => {
        if (view) {
            createCircle();
            view.map.addMany([circleLayer, dragLayer]);
            clickRef.current = view.on('immediate-click', clickHandle);
        }
    }, [view]);
    return (
        <>
            <MapBox setView={setView} />
        </>
    );
}
