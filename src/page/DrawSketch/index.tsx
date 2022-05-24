import MapBox from '@/components/MapBox';
import MapView from '@arcgis/core/views/MapView';
import { Button, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';

export default function DrawSketch() {
    const [view, setView] = useState<MapView>();
    const removeLayer = () => {
        const findLayer = view?.map.findLayerById('sketchdraw') as GraphicsLayer;
        if (findLayer) {
            findLayer.removeAll();
        }
    };
    const sketch = useMemo(() => {
        if (view) {
            const findLayer = view?.map.findLayerById('sketchdraw');

            if (findLayer) view?.map.remove(findLayer);
            const layer = new GraphicsLayer({ id: 'sketchdraw' });
            view.map.add(layer);
            return new SketchViewModel({
                layer,
                view,
                updateOnGraphicClick: true,
                pointSymbol: {
                    type: 'simple-marker',
                    color: 'red',
                    width: '',
                    height: '24',
                    outline: {
                        width: 1,
                        color: '#fff',
                    },
                } as any,
            });
        }
    }, [view]);
    const draw = (type: any) => {
        removeLayer();
        sketch?.create(type);
        sketch?.on('create', e => {
            console.log(e);
        });
    };

    return (
        <>
            <Space>
                <Button type="primary" onClick={() => draw('point')}>
                    绘制点
                </Button>
                <Button type="primary" onClick={() => draw('polyline')}>
                    绘制线
                </Button>
                <Button type="primary" onClick={() => draw('rectangle')}>
                    绘制矩形
                </Button>
                <Button type="primary" onClick={() => draw('polygon')}>
                    绘制面
                </Button>
                <Button type="primary" onClick={() => draw('circle')}>
                    绘制园
                </Button>
            </Space>
            <MapBox setView={setView} />
        </>
    );
}
