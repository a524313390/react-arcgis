import MapBox from '@/components/MapBox';
import MapView from '@arcgis/core/views/MapView';
import { Space, Button, message } from 'antd';
import React, { useState } from 'react'
import PrintTask from '@arcgis/core/tasks/PrintTask'
import PrintTemplate from '@arcgis/core/tasks/support/PrintTemplate'
import PrintParameters from '@arcgis/core/tasks/support/PrintParameters'
export default function Print() {
    const [view, setView] = useState<MapView>();
    const onClick = () => {
        var printTask = new PrintTask({
            url: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
        });

        var template = new PrintTemplate({
            format: "pdf",
            exportOptions: {
                dpi: 300
            },
            layout: "a4-portrait",
            layoutOptions: {
                titleText: "Warren Wilson College Trees",
                authorText: "Sam"
            }
        });

        var params = new PrintParameters({
            view: view,
            template: template
        });
        message.loading('打印中,请稍后')
        printTask.execute(params).then((printResult: any) => {
            if (printResult) {
                message.destroy()
                window.open(printResult.url)
            } else {
                message.error('打印出错,请重新尝试')
            }

        });
    }
    return (
        <><Space>
            <Button type="primary" onClick={onClick}>地图打印</Button>
        </Space>
            <MapBox setView={setView} />
        </>
    )
}
