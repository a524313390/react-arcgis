import MapBox from '@/components/MapBox';
import MapView from '@arcgis/core/views/MapView';
import { Space, Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D'
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D'
import AreaMeasurement2DViewModel from '@arcgis/core/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel'
import DistanceMeasurement2DViewModel from '@arcgis/core/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel'
import Measurement from '@arcgis/core/widgets/Measurement'
export default function Measure() {
    const [view, setView] = useState<MapView>();
    const [measureHandle, setMeasure] = useState<Measurement>();
    useEffect(() => {
        const measurement = new Measurement({
            viewModel: {
                view: view,

            }

        });
        setMeasure(measurement)
    }, []);

    const mwasureObj = useMemo(() => {
        if (view) {
            let distance = new DistanceMeasurement2D({
                view: view
            });
            let measure = new AreaMeasurement2D({
                view: view
            });
            return {
                distance,
                measure
            }
        }
    }, [view])
    const measure = (type: string) => {
        console.log(mwasureObj);

        if (!mwasureObj) return;
        if (type === '测距') {

            view?.ui.add(mwasureObj.distance, 'top-left')
        } else {

            view?.ui.add(mwasureObj.measure, 'top-left')
        }
    }
    const measure1 = async (type: string) => {
        console.log(measureHandle);

        if (!measureHandle) return;

        if (type === '测距') {
            measureHandle.activeTool = 'distance'
        } else {
            measureHandle.activeTool = 'area'

        }
    }
    const deleteMeasure = () => {

        measureHandle?.clear();
        if (!mwasureObj) return


    }
    return (
        <>
            <Space>
                <Button type='primary' onClick={() => measure('测距')}>测距</Button>
                <Button type='primary' onClick={() => measure('测面')}>侧面</Button>
                <Button type='primary' onClick={() => measure1('测距')}>测距1</Button>
                <Button type='primary' onClick={() => measure1('测面')}>侧面1</Button>
                <Button type='primary' onClick={deleteMeasure}>删除</Button>
            </Space>
            <MapBox setView={setView} />
        </>
    )
}
