import React from 'react'
import ReactDOM from 'react-dom'
import RouterBox from '@/router';
import "@arcgis/core/assets/esri/themes/light/main.css"
import '@/assets/index.less'
import 'antd/dist/antd.css';
console.log(12312)
ReactDOM.render(
    <React.StrictMode>
        <RouterBox />
    </React.StrictMode>,
    document.getElementById('root')
)
