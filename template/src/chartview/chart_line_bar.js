define(function(require){
	/* 线图,柱状图,柱状堆叠图 */
	var util=require('./util');
	var o={};

	o.show=function(domid,data,cubeid,type,stack) { 
		var dom = document.getElementById(domid);
		var chart = echarts.init(dom,dz.echarts_theme);
		
		var annex = data.annex;
		var legend_data = [];
		var yAxis = [
			{name:'',type:'value',scale:true},
		];
		var yAxisMap = {};
		var xData = [];
		var series = [];

		//1. 处理维度和指标,抽取x轴key,和y轴
		var xKey = '';
		var dateKey = '';
        var si = 0;
        var sk = '';
		for (var colKey in annex.headmap) {
			var colInfo = annex.headmap[colKey];
			// 维度
			if (colInfo['dimtable']) {
				if (xKey=='') xKey=colKey;
				if (colInfo['dimtable']=='date') dateKey=colKey;
			}
			// 指标
			else if (colInfo['mkey']) {
                sk = colKey;
				yAxisMap[colKey] = 0;   //!< 指标对应的y轴序号
                ++si;
			}
		}
        ///////////////////////////////////////
/*
        // 最后一个选副纵轴
        if (si>1 && !stack) {
            yAxis.push({name:'',type:'value',scale:true});
            yAxisMap[sk] = 1;
        }
*/
        ///////////////////////////////////////
		if (dateKey!='') xKey=dateKey;  //!< 如果有日期维度,选择日期维度为x轴,否则选择第一个分组维度为x轴
		if (xKey=='') {
			throw new Error('请至少选择一个分组');
		}

		//2. 抽取x轴数据
		var xmap = {};
		for (var i=0;i<data.root.length;++i) {
			var row = data.root[i];
			var xim = row[xKey];
			if (!xmap[xim]) xmap[xim] = 1;
		}
		var xlist = array_keys(xmap);
        xlist.sort(function(a,b){
            if (/^[0-9]+[.|:]?[0-9]*$/.test(a) && /^[0-9]+[.|:]?[0-9]*$/.test(b)) {
                var n1 = parseFloat(a.replace(":","."));
                var n2 = parseFloat(b.replace(":","."));
                return n1-n2;
            } else {
                return a>b ? 1 : -1;
            }
        });

		var xlen = xlist.length;
		for (var i=0;i<xlen;++i) {
			var xim = xlist[i];
			xmap[xim] = i;
			var xd = util.get_format_date_x(xim);  //!< 先看看是否日期
			if (xd==xim) {
				xd = util.dimid2name(cubeid,xKey,xd);	//!< 维度ID转字面
			}
			xData.push(xd);
		}

		//3. 抽取series和legend
		var serieMap = {};
		for (var i=0;i<data.root.length;++i) {
			var row = data.root[i];
			var dims = [];
			var metrics = [];
			for (var col in row) {
				if (col==xKey) continue;	//!< x轴列不参与legend计算
				var colinfo = annex.headmap[col];
				if (!colinfo) continue;	
				// 维度
				if (colinfo['dimtable']) {
					var dimstr = row[col];
					//////////////////////////////////
					// 维度ID转成维度字面
					dimstr = util.dimid2name(cubeid,col,dimstr);
					//////////////////////////////////
					dims.push(dimstr);
				}
				// 指标
				else metrics.push(col);
			}
			var xloc = row[xKey];  //!< x坐标
			var xi = xmap[xloc];	  //!< x坐标对应的序号
			// 维度组合与每个指标的笛卡尔积作为key
			for (var m=0;m<metrics.length;++m) {
				var metric = metrics[m];
				var metricInfo = annex.headmap[metric]
				var skey = dims.join('_')+"#"+metric;
                var serieName = metricInfo.mname;
				if (dims.length>0) serieName+='('+dims.join('_')+')';
				if (!isset(serieMap[skey])) {
					// 新增一条serie
					serieMap[skey] = {
						id: skey,
						name: serieName,
						type: type,		//'line',
						areaStyle: {normal: {}},
						yAxisIndex: yAxisMap[metric],
						data: []
					};
                    //////////////////////////////////////////////
                    // 柱状堆叠
                    if (stack) serieMap[skey]['stack'] = 'one';
                    //////////////////////////////////////////////
					if (metrics.length<=3) {
						serieMap[skey]['markLine'] = { 
                   			data : [ 
                      			{type:'average', name:'平均值'}
                   			]   
                		};
						serieMap[skey]['markPoint'] = {
							data : [ 
                        		{type:'max', name:'最大值',itemStyle:{normal:{opacity:0.8}}}
                    		]
						};
					}
					for (var k=0;k<xlen;++k)serieMap[skey]['data'].push(0);
					// 同时也要新增一个legend
					legend_data.push(serieName);
				}
				serieMap[skey]['data'][xi] = row[metric];
			}
		}
		// map转array
		for (var i in serieMap) {
			series.push(serieMap[i]);
		}

		//print_r(series);
		//print_r(legend_data);
		var option = {
			tooltip: {trigger:'axis'},
			grid: {top:30},
			legend: {x:'center',y:'bottom',type:'scroll',data:legend_data},
			xAxis: [{
				type : 'category',
				data : xData
			}],
			yAxis: yAxis,
    		series : series
		};
		chart.setOption(option);
	};

	return o;
});
