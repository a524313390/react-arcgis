export const dev = false;
interface BaseLayerItem {
    id: string;
    visible: boolean;
    url: string;
    name: string;
}
let baseLayer: BaseLayerItem[] = dev ? [
    { id: "wyl", visible: true, name: '午夜蓝地图', url: 'http://172.16.9.114:6080/arcgis/rest/services/BaseMap/BlueMap2019_2000/MapServer' },
    { id: "dz", visible: false, name: '彩色地图', url: 'http://172.16.9.114:6080/arcgis/rest/services/BaseMap/szdzdt2019_2000/MapServer' },

    { id: "yx", visible: false, name: '灰色地图', url: 'http://172.16.9.114:6080/arcgis/rest/services/BaseMap/ZJG_Raster2000/MapServer' },
] : [
    { id: "wyl", visible: true, name: '午夜蓝地图', url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer' },
    { id: "dz", visible: false, name: '彩色地图', url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer' },

    { id: "yx", visible: false, name: '灰色地图', url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer' },
]

const arcgisApiRoot = 'http://172.16.9.123:7007';
export const ArcGISOptions = {
    // 代理地址
    proxy: arcgisApiRoot + '/arcgis_js_api/proxy/DotNet/proxy.ashx',
    // 字体地址
    fontUrl: arcgisApiRoot + '/arcgis_js_api/font'
};

export const feartureLayer = {
    hcz: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/trainstation_WebMokatuo/FeatureServer',
    queryTaskUrl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer/0',
}

export { baseLayer }