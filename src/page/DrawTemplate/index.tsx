import MapBox from '@/components/MapBox'
import MapView from '@arcgis/core/views/MapView';
import { Button, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import Draw from '@arcgis/core/views/draw/Draw'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic';
import Point from "@arcgis/core/geometry/Point";
import Polyline from '@arcgis/core/geometry/Polyline'
import Polygon from '@arcgis/core/geometry/Polygon'
import Circle from '@arcgis/core/geometry/Circle'
var graphicsLayer = new GraphicsLayer();
export default function DrawTemplate() {
    const [view, setView] = useState<MapView>();
    const [drawHandle, setDraw] = useState<Draw>();
    useEffect(() => {
        if (view) {
            view.map.add(graphicsLayer)
            var draw = new Draw({
                view: view,

            });
            setDraw(draw)
        }
    }, [view]);
    const drawPoint = () => {
        let symbol = {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            color: "red",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: [128, 128, 128, 0.5],
                width: "0.5px"
            }
        };
        graphicsLayer.removeAll()
        var action = drawHandle?.create("point", { mode: "click" });
        action?.on('draw-complete', e => {

            const { coordinates } = e;
            const point = new Point({
                x: coordinates[0],
                y: coordinates[1],
                spatialReference: view?.spatialReference
            })
            const grap = new Graphic({
                geometry: point,
                symbol
            })
            graphicsLayer.add(grap)

        })
    }
    const createPolyline = (event: any) => {
        let symbol = {
            type: "simple-line", // autocasts as new SimpleFillSymbol
            color: 'red',
            width: 4,
            cap: "round",
            join: "round"
        }

        //获取所有顶点
        var vertices = event.vertices;
        //清除之前绘制
        graphicsLayer.removeAll();
        // 生成绘制的图形

        var graphic = new Graphic({
            geometry: new Polyline({
                paths: vertices,
                spatialReference: view?.spatialReference
            }),
            symbol: symbol
        });
        // 将绘制的图形添加到view
        graphicsLayer.add(graphic);
    };
    const drawpolyLine = () => {
        graphicsLayer.removeAll()

        var action = drawHandle?.create("polyline", { mode: "click" });

        // 顶点添加事件
        action?.on("vertex-add", createPolyline);
        // 鼠标移动事件
        action?.on("cursor-update", createPolyline);
        // 绘制完成事件
        action?.on("draw-complete", createPolyline);
    }

    const createRectangle = (e: any) => {
        let symbol = {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [51, 51, 204, 0.9],
            style: "solid",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: "white",
                width: 1
            }
        }
        const { vertices } = e;
        if (vertices.length <= 1) {
            return false;
        }
        var rings = [vertices[0], [vertices[0][0], vertices[1][1]], vertices[1], [vertices[1][0], vertices[0][1]]];
        console.log(rings);
        //清除之前绘制
        graphicsLayer.removeAll();

        // 生成绘制的图形
        var graphic = new Graphic({
            geometry: new Polygon({
                hasZ: false,
                hasM: false,
                rings: [rings],
                spatialReference: view?.spatialReference
            }),
            symbol: symbol
        });
        graphicsLayer.add(graphic)

    }
    const drawRect = () => {
        const action = drawHandle?.create('rectangle', { mode: "click" });
        action?.on('vertex-add', createRectangle)
        // 鼠标移动事件
        action?.on("cursor-update", createRectangle);
        action?.on("draw-complete", createRectangle);
    }
    const createArea = (e: any) => {
        let symbol = {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [51, 51, 204, 0.9],
            style: "solid",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: "white",
                width: 1
            }
        }
        const { vertices } = e;
        if (vertices.length <= 1) {
            return false;
        }

        //清除之前绘制
        graphicsLayer.removeAll();

        // 生成绘制的图形
        var graphic = new Graphic({
            geometry: new Polygon({
                hasZ: false,
                hasM: false,
                rings: vertices,
                spatialReference: view?.spatialReference
            }),
            symbol: symbol
        });
        graphicsLayer.add(graphic)

    }
    const drawArea = () => {
        const action = drawHandle?.create('polygon', { mode: "click" });
        action?.on('vertex-add', createArea)
        // 鼠标移动事件
        action?.on("cursor-update", createArea);
        action?.on("draw-complete", createArea);
    }
    const createCircle = (event: any) => {
        graphicsLayer.removeAll()
        let symbol = {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [51, 51, 204, 0.9],
            style: "solid",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: "white",
                width: 1
            }
        }
        var vertices = event.vertices;
        //少于一个点无法展示圆
        if (vertices.length < 2) {
            return
        }
        //清除之前绘制
        view?.graphics.removeAll();
        //生成绘制的图形,两点画圆
        var center = new Point({
            hasZ: false,
            hasM: false,
            x: vertices[0][0],
            y: vertices[0][1],
            spatialReference: view?.spatialReference,

        });
        var dis = center.distance(new Point({
            hasZ: false,
            hasM: false,
            x: vertices[1][0],
            y: vertices[1][1],
            spatialReference: view?.spatialReference
        }));
        var graphic = new Graphic({
            geometry: new Circle({
                hasZ: false,
                hasM: false,
                center: center,
                radius: dis,
                spatialReference: view?.spatialReference
            }),
            symbol: symbol
        });
        // 将绘制的图形添加到view
        graphicsLayer.add(graphic);
    }
    const drawCircle = () => {
        const action = drawHandle?.create('circle', { mode: "click" });
        action?.on('vertex-add', createCircle)
        // 鼠标移动事件
        action?.on("cursor-update", createCircle);
        action?.on("draw-complete", createCircle);
    }
    return (
        <>
            <Space>
                <Button type="primary" onClick={drawPoint}>绘制点</Button>
                <Button type="primary" onClick={drawpolyLine}>绘制线</Button>
                <Button type="primary" onClick={drawRect}>绘制矩形</Button>
                <Button type="primary" onClick={drawArea}>绘制面</Button>
                <Button type="primary" onClick={drawCircle}>绘制园</Button>
            </Space>
            <MapBox setView={setView} />
        </>
    )
}
