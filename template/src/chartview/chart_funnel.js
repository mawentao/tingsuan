define(function(require){
	/* 漏斗图(1-N个分组,1个指标) */
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
		if (dims.length>0) throw new Error('不能选择分组');
		if (metrics.length==0) throw new Error('请选择选择1-N个指标');
		if (data.root.length==0) throw new Error('查询数据为空');

		var row1 = data.root[0];
		var funnelData = [];
		var fm = 0;   //!< 取最大值为分母
		for (var i=0;i<metrics.length;++i) {
			var mim = metrics[i];
			var mkey = mim.mkey;
			var mvalue = parseFloat(row1[mkey]);
			funnelData.push({name:mim.mname,value:Math.abs(mvalue)});
			if (mvalue>fm) fm=mvalue;
		}
		
		
		// 计算漏斗率
		var funnelDataList = [];
		var descKeys = Object.keys(funnelData).sort(function(a,b){return funnelData[b].value-funnelData[a].value});

		for (var i=0; i<descKeys.length; ++i) {
			var m = descKeys[i];
			var fitem = funnelData[m];
			var v = funnelData[m].value;
			fitem.value = parseInt(v*100000/fm)/1000;   //!< 比例(保留3位小数)
			funnelDataList.push(fitem);
		}

		// 画漏斗图
		show_funnel(domid,funnelDataList,'');
	};

	// 画漏斗图
	function show_funnel(domid,data,title)
	{/*{{{*/
		var dom = document.getElementById(domid);
        chart = echarts.init(dom,dz.echarts_theme);
		var colorPalette = chart._theme.color;

        var legend_data = []; 
        for (var k=0;k<data.length;++k) {
			var da=data[k];
			legend_data.push(da.name);
        }

        var option = { 
            title: { show: false, },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c}%"
            },  
            legend: {
				show: true,
                x:'center', y:'bottom',
                //orient: 'vertical',
                data: legend_data
            },
            series: [{
				type : 'funnel',
				name : '漏斗',
				top  : 2,
				bottom: 30,
				left : 20,
				label: { normal:{formatter:"{b}\n({c}%)",position:'outside'} },
				data : data
			}]
        };
        chart.setOption(option);
	}/*}}}*/

	return o;
});
