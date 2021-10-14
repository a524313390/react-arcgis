import MapBox from '@/components/MapBox'
import { baseLayer, feartureLayer } from '@/config'
import MapView from '@arcgis/core/views/MapView'
import { Button, message, Space } from 'antd'
import React, { useState } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import './index.less'
import ReactDOM from 'react-dom'
import PopupBox from '@/components/PopupBox'


export default function BaseToggle() {
    const [view, setView] = useState<MapView>();
    if (view) {
        // let dom = view.popup.container as HTMLDivElement;
        // dom.classList.add('custom-popup')
        // view.popup.viewModel.actions = [] as unknown as __esri.Collection; //去除popup内所有动作按钮
        // view.popup.dockOptions.buttonEnabled = false; //去除popup右上角dock按钮
        // view.popup.collapseEnabled = false; //去除点击title收缩事件
        // view.popup.visibleElements.featureNavigation = false; //去除多个feature导航按钮
        // view?.on('click', event => {


        //     view.hitTest(event).then(response => {
        //         console.log(response);

        //         if (response && response.results.length > 0) {
        //             let graphic = response.results.find(item => {

        //                 return item.graphic.layer.id === 'hcz'
        //             })

        //             if (graphic) {
        //                 console.log(graphic.graphic.geometry);

        //                 let geometry = graphic.graphic.geometry
        //                 let template = {
        //                     location: geometry,
        //                     content: '123132'
        //                 }
        //                 view.popup.open(template)
        //                 console.log(view.popup);

        //             }
        //         }

        //     })

        // })
    }
    const onClick = (obj: { id: string }) => {
        const { id } = obj;
        const baseLayer = view?.map.basemap.baseLayers;

        baseLayer?.forEach(layer => {
            if (layer.id === id) {
                layer.visible = true
            } else {
                layer.visible = false;
            }
        })

    }
    const addFeartureLayer = () => {
        const layer = new FeatureLayer({
            url: feartureLayer.hcz,
            id: 'hcz',
            popupTemplate: {

                content: '1232121'
            }
        })
        view && view.map.add(layer)


    }
    const removeFeatureLayer = () => {
        const find = view?.map.findLayerById('hcz')
        if (find) {
            view?.map.remove(find)
        } else {
            message.warning('请先加载业务图层')
        }
    }
    return (
        <>
            <div className='map-toggle'>
                <Space size='large'>
                    {baseLayer.map(item => {
                        return (
                            <Button type='primary' key={item.id} onClick={() => onClick(item)}>{item.name}</Button>
                        );
                    })}
                    <Button type='primary' onClick={addFeartureLayer}>加载featureLayer图层</Button>
                    <Button type='primary' onClick={removeFeatureLayer}>删除featureLayer图层</Button>
                </Space>
            </div>
            <MapBox setView={setView} />
        </>
    )
}
