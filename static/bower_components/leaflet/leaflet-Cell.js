(function (win, doc) {
    var L = win.L;
    L.CellMarker = L.DivIcon.extend({
        includes: L.Mixin.Events,
        options: {
             icon: new L.divIcon({ iconSize: [20, 20], iconAnchor: [20, 20], popupAnchor: [20, 20], html:''}),
            // title: '',
            // alt: '',
            clickable: true,
            draggable: false,
            normalZoom:15,//图标正常显示时的，缩放比例
            minZoom:12,//最小缩放比例
            zIndexOffset: 0,
            opacity: 1,
            riseOnHover: false,
            riseOffset: 250
            ,cellType:1,//小区类型，1，普通小区，2：室内，0：宏站
            netType:4,//网络类型，
            angle:0,
            zoomAnimation:true
            ,cellColors:{1:'green',7:'red',5:'blue',8:'purple',10:'#ff3399'}//基站颜色定义
        },

        initialize: function (latlng, options) {
            L.setOptions(this, options);
            this._latlng = L.latLng(latlng);
            //this.config = L.Util.extend(this.config, config);
        },

        onAdd: function (map) {
            this._map = map;

            map.on('viewreset', this.update, this);

            this._initIcon();
            this.update();
            this.fire('add');

            if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
                map.on('zoomanim', this._animateZoom,this);
                
            }
            map.on('zoomend', this._zoomend,this);
        },
        _zoomend:function (opt) {
            if(opt.target.getZoom()>=this.options.minZoom){
                this._icon.style.display='block';
            }else{
                this._icon.style.display='none';
            }
        },
        addTo: function (map) {
            map.addLayer(this);
            return this;
        },

        onRemove: function (map) {
            if (this.dragging) {
                this.dragging.disable();
            }

            this._removeIcon();
           

            this.fire('remove');

            map.off({
                'viewreset': this.update,
                'zoomanim': this._animateZoom
                ,'zoomend': this._zoomend
            }, this);

            this._map = null;
        },

        getLatLng: function () {
            return this._latlng;
        },

        setLatLng: function (latlng) {
            this._latlng = L.latLng(latlng);

            this.update();

            return this.fire('move', { latlng: this._latlng });
        },

        setZIndexOffset: function (offset) {
            this.options.zIndexOffset = offset;
            this.update();

            return this;
        },

        //setIcon: function (icon) {

        //    this.options.icon = icon;

        //    if (this._map) {
        //        this._initIcon();
        //        this.update();
        //    }

        //    if (this._popup) {
        //        this.bindPopup(this._popup);
        //    }

        //    return this;
        //},

        update: function () {
            if (this._icon) {
                this._setPos(this._map.latLngToLayerPoint(this._latlng).round());
            }
            return this;
        },

        _initIcon: function () {
            var options = this.options,
                map = this._map,
                animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
                classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

            var icon =  options.icon.createIcon(this._icon);
            var w = options.iconSize[0];
              var  addIcon = false;
            //icon.html = "";
            // if we're not reusing the icon, remove the old one and init new one
            if (icon !== this._icon) {
                if (this._icon) {
                    this._removeIcon();
                }
                addIcon = true;

                if (options.title) {
                    icon.title = options.title;
                }

                if (options.alt) {
                    icon.alt = options.alt;
                }
            } 
            // var r = this.config.angle-30;
            // var rotate = "transform:rotate("+r+"deg) ;transform-origin:0 0;-ms-transform:rotate("+r+"deg);-moz-transform:rotate("+r+"deg);-webkit-transform:rotate("+r+"deg);-o-transform:rotate("+r+"deg);";
            icon.setAttribute('style', "transform-origin:0 0;background:transparent;width:"+w+"px;height:"+w+"px;border:0px;");//background:  transparent;
            var ca =L.DomUtil.create("canvas","");   
           
            L.DomUtil.addClass(icon, classToAdd);
            
            ca.setAttribute('style', "border:0px;width:100%;height:100%;");//+rotate
            ca.width = w;
            ca.height = w;
            var ctx = ca.getContext("2d");
           if(options.cellType!=2){
               ctx.moveTo(0,0)
                ctx.arc(0,0,w,0,0.3*Math.PI,false)
            
           }else{
               //室内站
               ctx.moveTo(w/2,w/2)
               ctx.arc(w/2,w/2,w/2,0,2*Math.PI,false)
           }
            //var c = "#FFFF"+(255-options.netType * 20)+""+(255-options.netType * 30);
            ctx.fillStyle = this.options.cellColors[this.options.netType];//"green";
            ctx.fill();
            if(this.options.cellType==0){
                
                ctx.beginPath();
                ctx.lineWidth=3;
                ctx.strokeStyle="#00ccff";
                //ctx.moveTo(w/3,w/3);
                ctx.arc(w/2+1,w/3-0.5,w/5,0,2*Math.PI,false)
                ctx.stroke();
            }
            
            if (options.keyboard) {
                icon.tabIndex = '0';
            }

            icon.appendChild(ca);
            this._icon = icon;

            this._initInteraction();

            if (options.riseOnHover) {
                L.DomEvent
                    .on(icon, 'mouseover', this._bringToFront, this)
                    .on(icon, 'mouseout', this._resetZIndex, this);
            }

           


            if (options.opacity < 1) {
                this._updateOpacity();
            }


            var panes = this._map._panes;

            if (addIcon) {
                panes.markerPane.appendChild(this._icon);
            }

           
        },

        _removeIcon: function () {
            if (this.options.riseOnHover) {
                L.DomEvent
                    .off(this._icon, 'mouseover', this._bringToFront)
                    .off(this._icon, 'mouseout', this._resetZIndex);
            }

            this._map._panes.markerPane.removeChild(this._icon);

            this._icon = null;
        },

      

        _setPos: function (pos) {
            L.DomUtil.setPosition(this._icon, pos);

            if (L.DomUtil.TRANSFORM) {
                        // use the CSS transform rule if available
                        this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + (this.options.angle-30) + 'deg)';
                        //scale(1.2)
                        var w = (1+(this._map.getZoom()-this.options.normalZoom)/3.0);
                        this._icon.style[L.DomUtil.TRANSFORM] += ' scale(' +( w>0?w:0.2) + ')';
                    } else if (L.Browser.ie) {
                        // fallback for IE6, IE7, IE8
                        var rad = (this.options.angle-30) * (Math.PI / 180),
                            costheta = Math.cos(rad),
                            sintheta = Math.sin(rad);
                        this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
                            costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
                    }
            this._zIndex = pos.y + this.options.zIndexOffset;

            this._resetZIndex();
        },

        _updateZIndex: function (offset) {
            this._icon.style.zIndex = this._zIndex + offset;
        },

        _animateZoom: function (opt) {
           var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

           this._setPos(pos);
           
        },

        _initInteraction: function () {

            if (!this.options.clickable) { return; }

            // TODO refactor into something shared with Map/Path/etc. to DRY it up

            var icon = this._icon,
                events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

            L.DomUtil.addClass(icon, 'leaflet-clickable');
            L.DomEvent.on(icon, 'click', this._onMouseClick, this);
            L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

            for (var i = 0; i < events.length; i++) {
                L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
            }

            if (L.Handler.MarkerDrag) {
                this.dragging = new L.Handler.MarkerDrag(this);

                if (this.options.draggable) {
                    this.dragging.enable();
                }
            }
        },

        _onMouseClick: function (e) {
            var wasDragged = this.dragging && this.dragging.moved();

            if (this.hasEventListeners(e.type) || wasDragged) {
                L.DomEvent.stopPropagation(e);
            }

            if (wasDragged) { return; }

            if ((!this.dragging || !this.dragging._enabled) && this._map.dragging && this._map.dragging.moved()) { return; }

            this.fire(e.type, {
                originalEvent: e,
                latlng: this._latlng
            });
        },

        _onKeyPress: function (e) {
            if (e.keyCode === 13) {
                this.fire('click', {
                    originalEvent: e,
                    latlng: this._latlng
                });
            }
        },

        _fireMouseEvent: function (e) {

            this.fire(e.type, {
                originalEvent: e,
                latlng: this._latlng
            });

            // TODO proper custom event propagation
            // this line will always be called if marker is in a FeatureGroup
            if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
                L.DomEvent.preventDefault(e);
            }
            if (e.type !== 'mousedown') {
                L.DomEvent.stopPropagation(e);
            } else {
                L.DomEvent.preventDefault(e);
            }
        },

        setOpacity: function (opacity) {
            this.options.opacity = opacity;
            if (this._map) {
                this._updateOpacity();
            }

            return this;
        },

        _updateOpacity: function () {
            L.DomUtil.setOpacity(this._icon, this.options.opacity);
            if (this._shadow) {
                L.DomUtil.setOpacity(this._shadow, this.options.opacity);
            }
        },

        _bringToFront: function () {
            this._updateZIndex(this.options.riseOffset);
        },

        _resetZIndex: function () {
            this._updateZIndex(0);
        }
    });

    L.cellMarker = function (latlng, option) {
        return new L.CellMarker(latlng, option);
    }
    
    //celllayer
    L.CellLayer = L.FeatureGroup.extend({
	options: {
		icon: {						
			iconSize: [20, 20]
		}
        // ,cellClick:function (cell ,layer) {
        //     
        // }
	},

	initialize: function (cells, options) {
		this.options=L.Util.extend(this.options,options);//L.setOptions(this, options);
		L.FeatureGroup.prototype.initialize.call(this, cells);
	},

	addLayers: function (cells) {
		if (cells) {
			for (var i = 0, len = cells.length; i < len; i++) {
				this.addLayer(cells[i]);
			}
		}
		return this;
	},

	addLayer: function (cell) {	
        var marker =this.createMarker(cell);
		L.FeatureGroup.prototype.addLayer.call(this,marker );
	},

/**
 * celldata ={lat:33.33,lng:109.33,cellType:1,//小区类型，1，普通小区，2：室内，3：宏站
            netType:4,//网络类型，
            angle:0,title:'描述'}
 */
	createMarker: function (cell) {
		var marker = L.cellMarker([cell.lat,cell.lng],cell);
        //绑定点击事件
        if(this.options.cellClick!=null ){
            marker.data = cell;
            marker.on('click', this.options.cellClick, marker,this);
            
        }
		return marker;
	}
});

L.cellLayer = function (cells, options) {
	return new L.CellLayer(cells, options);
};
//ajax
// if($http){
//     
// }
//聚集
if (L.MarkerClusterGroup) {

	L.CellLayer.Cluster = L.MarkerClusterGroup.extend({
		options: {
			featureGroup: L.cellLayer,		
			maxClusterRadius: 100,		
			showCoverageOnHover: false,
            
			iconCreateFunction: function(cluster) {
                /*
                position: absolute;top: -7px;right: -11px;color: #555;background-color: #fff;border-radius: 8px;height: 12px;min-width: 12px;
	line-height: 12px;
	text-align: center;
	padding: 3px;
	box-shadow: 0 3px 14px rgba(0,0,0,0.4);
                 */
				return new L.DivIcon(L.extend({
					className: '', 
					html: '<div>​<b>' + cluster.getChildCount() + '</b></div>'
				}, this.icon));
		   	},	
			icon: {						
				iconSize: [40, 40]
			}		   		
		},

		initialize: function (options) {	
			options = L.Util.setOptions(this, options);
			L.MarkerClusterGroup.prototype.initialize.call(this);
			this._cells = options.featureGroup(null, options);
            //this._cells.freezeAtZoom(14);
		},

		add: function (cells) {
			this.addLayer(this._cells.addLayers(cells));
			return this;
		},

		clear: function () {
			this._cells.clearLayers();
			this.clearLayers();
		}

	});

	L.cellLayer.cluster = function (options) {
        var cc =new L.CellLayer.Cluster(options);
        // cc.freezeAtZoom(10);
        //cc.unfreeze();
		return cc;	
	};

}
}(window,document));