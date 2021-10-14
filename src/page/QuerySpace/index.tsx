import MapBox from '@/components/MapBox';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import { Space, Button, message, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { feartureLayer } from '@/config';
import './index.less'
import { ColumnsType } from 'antd/lib/table';

import QueryTask from "@arcgis/core/tasks/QueryTask";
import Query from "@arcgis/core/rest/support/Query";
import Graphic from '@arcgis/core/Graphic';
const columns: ColumnsType<any> = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: '站名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '铁路局',
        dataIndex: 'tieluju',
        key: 'tieluju',
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: {
            showTitle: false,
        },
        render: address => (
            <Tooltip placement="topLeft" title={address}>
                {address}
            </Tooltip>
        ),
    },
];
const polygonSymbol = {
    type: 'simple-fill',
    color: 'rgba(216,30,6, 0.4)',
    style: 'solid',
    outline: {
        color: '#d81e06',
        width: 1,
    },
} as any;
export default function QuerySpace() {
    const [view, setView] = useState<MapView>();
    const [resultData, setResultData] = useState<any[]>([]);

    useEffect(() => {
        if (view) {
            const layer = new FeatureLayer({
                url: feartureLayer.hcz,
                id: 'hcz',
                popupTemplate: {

                    content: '1232121'
                }
            })
            view.map.add(layer)

            view.goTo({
                center: [104.072745, 30.663774]
            })
        }
    }, [view]);
    const query = () => {
        //先判断是否存在业务图层
        const resultLayer = view?.map.findLayerById('hcz') as FeatureLayer;
        if (!resultLayer) {
            message.warning('请先添加业务图层后在进行空间查询')
            return false;
        }
        const findLayer = view?.map.findLayerById('querySpace');
        if (findLayer) view?.map.remove(findLayer);
        const graphicLayer = new GraphicsLayer({ id: 'querySpace' });
        view?.map.add(graphicLayer);

        const sketchViewModel = new SketchViewModel({
            layer: graphicLayer,
            view,
            updateOnGraphicClick: false,
            polygonSymbol
        })
        sketchViewModel.create('polygon')
        sketchViewModel.on('create', e => {
            const { state } = e;
            if (state === 'complete') {
                //多边形画完之后进行查询
                const queryPolypon = resultLayer.createQuery()
                queryPolypon.geometry = e.graphic.geometry;
                message.loading('查询中,请稍后')
                resultLayer.queryFeatures(queryPolypon).then(res => {
                    if (res) {
                        let currentData: any[] = [];
                        const features = res.features;
                        features.map((item, index) => {
                            currentData.push({
                                name: item.attributes.name,
                                type: item.attributes.type,
                                tieluju: item.attributes.tieluju,
                                address: item.attributes.address,
                                lon: item.attributes.lon,
                                lat: item.attributes.lat,
                                key: index,
                            });
                        });
                        message.success(`查询成功,共${features.length}条数据`)

                        setResultData(currentData)
                    } else {
                        message.warning('查询出错')
                    }

                })
            }

        })
    }


    const queryTask = async () => {
        const queryTask = new QueryTask({
            url: feartureLayer.queryTaskUrl,
        });
        let query = new Query({ returnGeometry: true, outFields: ['*'], where: "Code like '3205%'" });


        const result2 = await queryTask.execute(query);
        const fillSymbol = {
            type: 'simple-fill',
            color: [188, 240, 234, 0.1],
            outline: {
                color: '#00FFFF',
                width: 2,
            },
        };
        if (result2) {
            let geometry = result2.features[0].geometry;
            console.log(geometry);

            let graphic = new Graphic({
                geometry: geometry,
                symbol: fillSymbol,
            });
            view?.graphics.add(graphic);

            view?.goTo({
                center: [
                    geometry.extent.center.longitude,
                    geometry.extent.center.latitude,
                ],
                zoom: 8,
            });
        } else {

        }


    }
    return (
        <div className='query-wrap'>
            <Space>
                <Button type="primary" onClick={query}>空间查询</Button>
                <Button type="primary" onClick={queryTask}>属性查询</Button>

            </Space>
            {
                resultData.length > 0 && <div className="query-result">
                    <Table dataSource={resultData} columns={columns} size="small" scroll={{ x: 300, y: 300 }} pagination={{
                        hideOnSinglePage: true,
                        total: resultData.length,
                        pageSize: resultData.length,
                    }} />;
                </div>
            }
            <MapBox setView={setView} />
        </div>
    )
}
