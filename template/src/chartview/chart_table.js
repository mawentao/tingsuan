define(function(require){
	/* 表格视图 */
	var util=require('./util');

	// 各种指标格式化函数
	function render_metric_0(v) {return metric_format(v,0);}
	function render_metric_1(v) {return metric_format(v,1);}
	function render_metric_2(v) {return metric_format(v,2);}
	function render_metric_3(v) {return metric_format(v,3);}
	function render_metric_4(v) {return metric_format(v,4);}
	function render_metric_100(v) {return metric_format(v,100);}

	var o={};

	// 渲染显示
	o.show=function(domid,data,cubeid) {
		// 处理维度和指标
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
		if (metrics.length==0) throw new Error('请选择1-N个指标');

		///////////////////////////////////////////////////
		// 将维度ID转成名称
		for (var i=0;i<data.root.length;++i) {
			var im = data.root[i];
			for (k in im) {
				var km = data.annex.headmap[k];
				if (!km) continue;
				if (km['dimtable']) {  //!< 维度列需要把维度ID转成名称
					im[k] = util.dimid2name(cubeid,k,im[k]);
				} else {
                    im[k] = 1*im[k];    //!< 指标值转成数字
                }
			}
		}
		///////////////////////////////////////////////////

		// 列
		var cms = [];
		// 维度列
		for (var i=0;i<dims.length;++i) {
			var im = dims[i];
			var cim = {
				head      : im.dimname,
				dataIndex : im.dimkey,
				align     : 'left',
				width     : 100
			}
			cms.push(cim);
		}
		// 指标列
		for (var i=0;i<metrics.length;++i) {
			var im = metrics[i];
			var cim = {
				head      : im.mname,
				dataIndex : im.mkey,
				align     : 'right',
                sort      : true,
				width     : 100
			}
			switch (parseInt(im.mformat)) {
				case 0: cim['render']=render_metric_0; break;
				case 1: cim['render']=render_metric_1; break;
				case 2: cim['render']=render_metric_2; break;
				case 3: cim['render']=render_metric_3; break;
				case 4: cim['render']=render_metric_4; break;
				case 100: cim['render']=render_metric_100; break;
			}
			cms.push(cim);
		}		
       
        var store = new MWT.Store({
            proxy: new mwt.MemoryProxy({
                data: data.root
            })
        });

		//var store = new MWT.Store({});
		var grid = new MWT.Grid({
            render: domid,
            store: store,
            pagebar: false, //!< false 表示不分页
            pageSize: 10,
            multiSelect:false, 
            bordered: false,
            tbarStyle: 'margin-bottom:10px;',
            emptyMsg: '<center>没有找到记录哦</center>',
//            position: 'fixed',
            bodyStyle: 'top:31px;bottom:0px;',
			striped: true,
			cm: new MWT.Grid.ColumnModel(cms)
        });
        grid.create();

		store.load(data.root);
	}


	return o;
});
