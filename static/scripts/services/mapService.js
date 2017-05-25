(function (ng,win,doc) {
    var mapModule = ng.module("map-service", ["ui-leaflet"])
    mapModule.service('mapService',['leafletData',function (leafletData){
        var L = win.L;
        var service =function () {
            return {
            'initMap' : function (mapID,options,callback) {
                var map = null;
                leafletData.getMap(mapID).then(function (map) {
                   var L =window.L;
                    /*Option	Type	Default	Description
                        center	LatLng	null	Initial geographical center of the map.
                        zoom	Number	null	Initial map zoom.
                        layers	ILayer[]	null	Layers that will be added to the map initially.
                        minZoom	Number	null	Minimum zoom level of the map. Overrides any minZoom set on map layers.
                        maxZoom	Number	null	Maximum zoom level of the map. This overrides any maxZoom set on map layers.
                        maxBounds	LatLngBounds	null	When this option is set, the map restricts the view to the given geographical bounds, bouncing the user back when he tries to pan outside the view. To set the restriction dynamically, use setMaxBounds method
                        crs	CRS	L.CRS.
                        EPSG3857	Coordinate Reference System to use. Don't change this if you're not sure what it means. */
    
                    options  = L.Util.setOptions(map, options)
                    //显示比例尺
                    if( options.scale){
                        L.control.scale().addTo(map);
                    }
                    
                    //显示图层信息
                    for (var l in options.baselayers) {
                        var layer = options.baselayers[l];
                        layer.addTo(map);
                        break;
                    }
                    for (var l in options.overlayLayers) {
                        var layer = options.overlayLayers[l];
                        layer.addTo(map);
                    }
                    if(options.layerControl){
                        var layerControl =  L.control.layers(options.baselayers, options.overlayLayers);
                        layerControl.addTo(map);
                        map.layerControl = layerControl;
                    }
                    //执行初始化回调
                   if(callback&&ng.isFunction(callback))
                        callback(map);
                   
                });
                
                return map;
            }
            //添加基站标签，mapid：地图容器id，latlng：点所在的经纬度对象，
            //options：点的配置信息，complete，添加完成后回调
            ,addCellMarker:function(mapID,latlng,options,complete){
                leafletData.getMap(mapID).then(function (map) {
                    var opt =L.Util.extend({ cellType: 1 ,netType:5,angle:0},options);
                    var m = L.cellMarker(latlng, opt);
                    m.addTo(map);
                     if(complete
                        && ng.isFunction(complete))
                          complete(m);
                });
            }
            //添加标记，mapid：地图容器id，latlng：点所在的经纬度对象，
            //options：点的配置信息，complete，添加完成后回调
            ,addMarker:function (mapID,latlng,options,complete) {
                leafletData.getMap(mapID).then(function (map) {
                    var m = L.marker(latlng);
                    options  = L.Util.setOptions(m, options);
                    m.addTo(map);
                    if(complete
                        && ng.isFunction(complete))
                          complete(m);
                });
            }
            //添加多边形，可以不闭合，mapid：地图容器id，latlngs：点的数组，
            //options：线的配置信息，addComplete，添加完成后回调
           , addPolyline:function (mapID,latlngs,options,addComplete) {
               leafletData.getMap(mapID).then(function (map) {
                  var opt =L.Util.extend({ color: 'red', fill: false,width:1 },options);
                   var polyline = L.polyline(latlngs,opt );
                
                    polyline.addTo(map);
                    if(addComplete&& ng.isFunction(addComplete))
                        addComplete(polyline);
               });
            }
            //添加多边形到地图上，mapid：地图容器id，latlngs：点的数组，必须大于等于3，如果点不闭合将会自动闭合，
            //options：线的配置信息，addComplete，添加完成后回调
            ,addPolygon:function (mapID,latlngs,options,addComplete) {
               leafletData.getMap(mapID).then(function (map) {
                  var opt =L.Util.extend({ color: 'red', fill: true, fillColor: 'blue' ,weight:1 },options);
                   if( latlngs.length>=3){
                       //闭合多边形
                       if (latlngs[0]!=latlngs[latlngs.length-1]) {
                           latlngs.push(latlngs[0]);
                       }
                        var polyline = L.polygon(latlngs,opt );
                        polyline.addTo(map);
                        if(addComplete&& ng.isFunction(addComplete))
                            addComplete(polyline);
                   }
                  
               });
            }
            //画点，mapid：地图容器id，latlng：点所在的经纬度对象，radius：半径，
            //options：点的配置信息，drawComplete，添加完成后回调
            ,addPoint:function (mapID,latlng,radius,options,drawComplete) {
                leafletData.getMap(mapID).then(function (map) {
                    var c = L.circle(latlng, radius, { color: 'red', fill: true, fillColor: 'green', fillOpacity: 0.7 });
                    options  = L.Util.setOptions(c, options);
                    c.addTo(map);
                    if(drawComplete
                        && ng.isFunction(drawComplete))
                          drawComplete(c);
                });
            }
            /*添加基站层，mapid：地图容器id，name:图层名称
            cellData:基站对象数组，格式：[{ cellID: 2, cellType: 1, netType: 5, name: "小区2", angle: 0,  lng: 106.61064147949217, lat: 23.900591030667897 }
                ,{ cellID: 12, cellType: 1, netType: 5, name: "小区12", angle: 80,  lng: 106.61064147949217, lat: 23.900591030667897 }
                ,{ cellID: 13, cellType: 1, netType: 5, name: "小区13", angle: 280,  lng: 106.61064147949217, lat: 23.900591030667897 }];
           */
            ,addCellLayer:function (mapID,name,cellDatas,options,addComplete) {
                leafletData.getMap(mapID).then(function (map) {
                    var opt =L.Util.extend({ color: 'red', fill: true, fillColor: 'blue' ,weight:1 },options);
                    var cl =L.cellLayer(cellDatas,opt);
                    cl.addTo(map);
                   map.layerControl.addOverlay(cl,name);
                    if(addComplete
                        && ng.isFunction(addComplete))
                          addComplete(cl);
                });
            }
            //画多变形，至少画3个点，小于3个点时双击取消，否则为完成，并执行回调，参数为当前画的多边形 
            ,DrawPolygon : function (mapID,drawComplete) {
                leafletData.getMap(mapID).then(function (map) {
                    var newPolyline = L.polyline([], { color: 'blue', weight: 1 });
                    newPolyline.addTo(map);
                    function  drawingPloylin(ev) {
                        newPolyline.addLatLng(ev.latlng);
                    }
               map.on('click',drawingPloylin);
                newPolyline.once('dblclick', function (ev) {
                    map.off('click',drawingPloylin);//删除画多边形的事件监听
                    var lls = newPolyline.getLatLngs();
                    if (lls.length >= 3) {
                        //自动闭合
                        newPolyline.addLatLng(lls[0])
                        //创建多边形 //添加填充色,添加到图层中
                        var polygon = L.polygon(newPolyline.getLatLngs()
                            , {fill:true,fillColor:'blue', weight:1 ,opacity:0.6});
                            //执行回调
                            if(drawComplete&& ng.isFunction(drawComplete))
                                drawComplete(polygon);
                    } 
                    //删除画线
                    map.removeLayer(newPolyline);
                });
                });
                
            }
        };
        }
        return service() ;
    }]);
}(window.angular,window,document))