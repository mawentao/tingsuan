define(function(require){
	/* 雷达图(1-N个分组,1-N个指标) */
	var util=require('./util');
	var o={};

	o.show=function(domid,data,cubeid) {
		var dims = [];
		var metrics = [];
		for (var colKey in data.annex.headmap) {
			var colInfo = data.annex.headmap[colKey];
			// 维度
			if (colInfo['dimtable']) {
				dims.push(colInfo);
			}
			// 指标
			else if (colInfo['mkey']) {
				metrics.push(colInfo);
			}
		}
		if (dims.length==0) throw new Error('请选择1-N个分组');
		if (metrics.length==0) throw new Error('请选择1-N个指标');

		// 分维度聚合各个指标
		var dimDataMap = {};
		for (var i=0;i<data.root.length;++i) {
			var row = data.root[i];		//!< 第i行数据
			// 遍历各个维度
			for (var d=0;d<dims.length;++d) {
				var dim = dims[d];
				var dimKey = dim.dimkey;
				if (!dimDataMap[dimKey]) dimDataMap[dimKey]={};
				var dimValue = row[dimKey];
				if (!dimDataMap[dimKey][dimValue]) dimDataMap[dimKey][dimValue] = {};
				// 遍历各个指标
				for (var m=0; m<metrics.length; ++m) {
					var mkey = metrics[m].mkey;
					var mvalue = parseFloat(row[mkey]);  //!< 指标值
					if (!dimDataMap[dimKey][dimValue][mkey]) dimDataMap[dimKey][dimValue][mkey] = 0;
					dimDataMap[dimKey][dimValue][mkey] += mvalue;
				}
			}
		}
		// 每个聚合维度一个图
		var metricKey = metrics[0].mkey;
		var maxNum = 10;  //!< 一个图最多显示10个分片,超出部分合并为其他
		var groups = [];
		for (var dimKey in dimDataMap) {
			if (!data.annex.headmap[dimKey]) continue;
			var diminfo = data.annex.headmap[dimKey];
			var groupItem = {
				name: diminfo.dimname+'分布',
				data: []
			};
			var mp = dimDataMap[dimKey];
			var dimmap=util.get_dim_data(cubeid,dimKey); //!< 维度ID映射表
			// 按第一个指标值倒序排序
			var descKeys = Object.keys(mp).sort(function(a,b){return mp[b][metricKey]-mp[a][metricKey]});
			for (var m=0; m<descKeys.length; ++m) {
				var dimKey = descKeys[m];
				var dk = dimmap[dimKey] ? dimmap[dimKey] : dimKey;  //!< 维度ID转成维度名称
				groupItem.data.push({
					name  : dk,
					mdata : mp[dimKey]	
				});
				if (m>=maxNum) break;
			}
			// 超出maxPieNum部分合并为其他
			if (m<descKeys.length) {
				var otherValue = {};
				while (m<descKeys.length) {
					var dimKey = descKeys[m];
					for (mkey in mp[dimKey]) {
						if (!otherValue[mkey]) otherValue[mkey]=0;
						otherValue[mkey] += mp[dimKey][mkey];
					}
					++m;
				}
				groupItem.data.push({name:'其他',mdata:otherValue});
			}
			// 添加到groups
			groups.push(groupItem);
		}
		//console.log(groups);
		
		show_radar(domid,groups,data.annex.headmap);

		return;
	};

	// 画雷达图(多个)
	function show_radar(domid,data,headMap)
	{/*{{{*/
		var dom = document.getElementById(domid);
        chart = echarts.init(dom,dz.echarts_theme);
		var colorPalette = chart._theme.color;

		////////////////////////////////////////////
		// 计算布局
		// 计算c * r 格
		var n = data.length;
		var width = jQuery('#'+domid).width();
		var height = jQuery('#'+domid).height()-30;
		var wh = width/height;
		var c=r=1;
		while (c*r<n) {
			if (c/r<wh) ++c;
			else ++r;
		}
		// 计算半径长度
		var wr = (width/c)/2;
		var hr = (height/r)/2;
		var radius = Math.min(wr,hr)-40;
		// 计算每个pie的圆心坐标
		var w = 100 / c;
		var h = 100 / r;
		var posarr=[];
		for (var i=0;i<n;++i) {
			var x = (i%c)*w+(w/2);
			var y = (i%r)*h+(h/2)-5;
			posarr.push([x+'%',y+'%']);
		}
		////////////////////////////////////////////
		var radar  = [];
        var series = []; 
        var legendMap = {}; 
        for (var i=0;i<data.length;++i) {
            var item = data[i];
			// radar
			var radarItem = {
				center: posarr[i],
				radius: radius,
				indicator: []
			};
			var maxValue = 0;
			var sDataMap = {};
            for (var k=0;k<item.data.length;++k) {
                var da=item.data[k];
				radarItem.indicator.push({
					text:da.name,
					max: 0,
				});
				// 取各指标的最大值为radar的maxValue
				for (var mkey in da.mdata) {
					var mInfo = headMap[mkey];
					var mname = mInfo.mname;
					// 指标为legend
					if (!legendMap[mkey]) {
						legendMap[mkey]=mname;
					}
					var mvalue = da.mdata[mkey];
					if (mvalue>maxValue) maxValue=mvalue;
					if (!sDataMap[mkey]) {
						sDataMap[mkey] = {name:mname,value:[]};
					}
					sDataMap[mkey].value.push(mvalue);
				}
			}
			for (var k=0;k<radarItem.indicator.length;++k) {
				radarItem.indicator[k].max = maxValue;
			}
			radar.push(radarItem);
			// serie
			var serieItem = {
				type       : 'radar',
				radarIndex : i,
				tooltip    : {trigger:'item'},
				itemStyle  : {
					normal: {
						areaStyle: {type: 'default'},
						color: function(params) {
							// 让每个饼图从头开始选颜色
                        	return colorPalette[params.dataIndex];
						}
					}
				},
				data : []
			};
			for (var s in sDataMap) serieItem.data.push(sDataMap[s]);
			series.push(serieItem);
        }  
		var legend_data=[];
		for (l in legendMap) legend_data.push(legendMap[l]);

        var option = { 
            tooltip    : {trigger: 'axis'},
            legend     : {x:'center', y:'bottom', data:legend_data},
            calculable : true,
			radar      : radar,
            series     : series
        };
        chart.setOption(option);
	}/*}}}*/

	return o;
});
