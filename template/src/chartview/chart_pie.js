define(function(require){
	/* 饼图(1-N个分组,1个指标) */
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
		if (metrics.length!=1) throw new Error('请选择一个且只选择一个指标');
		var metricInfo = metrics[0];
		var metricKey = metricInfo.mkey;

		// 分维度聚合
		var piemap = {};
		for (var i=0;i<data.root.length;++i) {
			var cols = data.root[i];
			var v = parseFloat(cols[metricKey]);  //!< 指标值
			// 遍历各个维度
			for (var k=0;k<dims.length;++k) {
				var dim = dims[k];
				var dimKey = dim.dimkey;
				if (!piemap[dimKey]) {piemap[dimKey]={};}
				var dimValue = cols[dimKey];
				if (!piemap[dimKey][dimValue]) piemap[dimKey][dimValue] = 0;
				piemap[dimKey][dimValue] += v;
			}
		}

		// 每个聚合维度画一张pie
		var pies = [];
		for (var k in piemap) {
			if (!data.annex.headmap[k]) continue;
			var diminfo = data.annex.headmap[k];
			var pim = {
				name: diminfo.dimname+'分布',
				data: []
			};
			var mp = piemap[k];
			var dimmap=util.get_dim_data(cubeid,k);	//!< 维度ID数据集
			// 按比例倒序排列
			var descKeys = Object.keys(mp).sort(function(a,b){return mp[b]-mp[a]});
			var maxPieNum = 10;  //!< 最多显示10个组成,超出部分合并为其他
			for (var m=0; m<descKeys.length; ++m) {
				var dimKey = descKeys[m];
				var v = mp[dimKey];
				var dk = dimmap[dimKey] ? dimmap[dimKey] : dimKey;  //!< 维度ID转成维度名称
				pim.data.push({name:dk,value:v});
				if (m>=maxPieNum) break;
			}
			// 超出maxPieNum部分合并为其他
			var otherValue = 0;
			while (m<descKeys.length) {
				var dimKey = descKeys[m];
				otherValue += mp[dimKey];
				++m;
			}
			if (otherValue!=0) {
				pim.data.push({name:'其余项汇总',value:otherValue});
			}
			// 添加到pies
			pies.push(pim);
		}
		show_pies(domid,pies,'');
	};

	// 画饼图(多个)
	function show_pies(domid,data,title)
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
		var radius = Math.min(wr,hr)-45;
		// 计算每个pie的圆心坐标
		var w = 100 / c;
		var h = 100 / r;
		var posarr=[];
		for (var i=0;i<n;++i) {
			var x = (i%c)*w+(w/2);
			var y = (i%r)*h+(h/2);// - 10;
			posarr.push([x+'%',y+'%']);
		}
		////////////////////////////////////////////

        var legend_data = []; 
        var serie_data = []; 
        for (var i=0;i<data.length;++i) {
            var item = data[i];
            for (var k=0;k<item.data.length;++k) {
                var da=item.data[k];
                legend_data.push(da.name);
            }   
            serie_data.push({
                type:'pie',
                name: item.name,
                center : posarr[i],
                //radius : [20, 80],
                radius : [0,radius],
				label: {
                    normal:{formatter:"{b} ({d}%)"}
                },
				itemStyle: {
					normal: {
                    	color: function(params) {
							// 让每个饼图从头开始选颜色
                        	return colorPalette[params.dataIndex];
                    	}
					}
                },
                data:data[i].data
            }); 
        }  

        var option = { 
            title: title,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },  
            legend: {
				show: false,
                x:'center', y:'bottom',
                //orient: 'vertical',
                data: legend_data
            },
            calculable: true,
            series: serie_data
        };
        chart.setOption(option);
	}/*}}}*/

	return o;
});
