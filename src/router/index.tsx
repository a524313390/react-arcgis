import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Home from '@/page/home';
import MapBox from '@/components/MapBox';
import Layouts from '@/Layouts';
import BaseToggle from '@/page/BaseToggle';
import DrawTepmlate from '@/page/DrawTemplate';
import { createFromIconfontCN } from '@ant-design/icons';
import QuerySpace from '@/page/QuerySpace';
import DrawSketch from '@/page/DrawSketch';
import ManyScreen from '@/page/ManyScreen';
import Cluster from '@/page/Cluster';
import Heat from '@/page/Heat';
import ClusterType from '@/page/ClusterType';
import ClusterImg from '@/page/ClusterImg';
import Print from '@/page/Print';
import Measure from '@/page/Measure';
import MapToggle from '@/page/MapToggle';
import CustomPopup from '@/page/CustomPopup';
const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_2757048_kosyf2ibsx.js',

    ],
});
export const menuList = [
    { name: '初始化地图', path: '/', component: Home, icon: <IconFont type="icon-map" />, exact: true },
    { name: '底图切换', path: '/basetoggle', component: BaseToggle, icon: <IconFont type="icon-dituqiehuan" />, exact: false },
    { name: '点线面绘制', path: '/draw', component: DrawTepmlate, icon: <IconFont type="icon-huizhi" />, exact: false },
    { name: 'sketch绘制点线面', path: '/sketchdraw', component: DrawSketch, icon: <IconFont type="icon-huizhi" />, exact: false },
    { name: '空间查询', path: '/querySpace', component: QuerySpace, icon: <IconFont type="icon-kongjianchaxun" />, exact: false },
    { name: '多屏对比', path: '/manyScreen', component: ManyScreen, icon: <IconFont type="icon-duoping" />, exact: false },
    { name: '聚合', path: '/clustertype', component: ClusterType, icon: <IconFont type="icon-juhe" />, exact: false },
    { name: '自定义聚合', path: '/cluster', component: Cluster, icon: <IconFont type="icon-juhe" />, exact: false },
    { name: '图片聚合', path: '/clusterimg', component: ClusterImg, icon: <IconFont type="icon-juhe" />, exact: false },
    { name: '热力', path: '/heat', component: Heat, icon: <IconFont type="icon-relitu" />, exact: false },
    { name: '地图打印', path: '/print', component: Print, icon: <IconFont type="icon-ziyuan5" />, exact: false },
    { name: '地图测量', path: '/measure', component: Measure, icon: <IconFont type="icon-celiang" />, exact: false },
    { name: '二三维切换', path: '/maptoggle', component: MapToggle, icon: <IconFont type="icon-ersanweiqiehuan" />, exact: false },
    { name: '自定义弹窗', path: '/custompopup', component: CustomPopup, icon: <IconFont type="icon-danchuang" />, exact: false },
]

const RouterBox = () => {
    return (

        <Router>
            <Layouts>
                <Switch>
                    {menuList.map(item => {
                        return (
                            <Route path={item.path} exact={item.exact} component={item.component} key={item.path}></Route>
                        );
                    })}

                    <Redirect to="/"></Redirect>
                </Switch>
            </Layouts>
        </Router>


    );
}
export default RouterBox