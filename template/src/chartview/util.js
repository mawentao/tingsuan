/* util.js, (c) 2017 mawentao */
define(function(require){ 

	var o={};

	// 显示异常信息 
	o.showExceptionMsgInBox=function(domid,msg) {
		var code = '<span class="empty">'+msg+'</span>';
		jQuery('#'+domid).html(code);
	};

	// 获取x轴上格式化日期
	o.get_format_date_x=function(day) {
		var re = new RegExp(/^\d{4}[-|/]\d{2}[-|/]\d{2}$/);
		if (!re.test(day)) return day;
		var tm = strtotime(day);
		var week = new Date(day).getDay();
		var weekmap = ['日','一','二','三','四','五','六'];
		return date('Y-m-d\n(周'+weekmap[week]+')',tm);
	};

	// 获取指标看板的格式化日期
	o.get_format_date_index=function(day) {
		var weekmap = ['日','一','二','三','四','五','六'];
		var tm = strtotime(day);
		var week = new Date(day).getDay();
		return date('m月d日(周'+weekmap[week]+')',tm);
	};


	// 获取维度数据集
	o.get_dim_data = function(cubeid,dimkey) {
		//1. 获取维度对应的维度表
		var dimtable = '';
		var cubeinfo = require('model/cube').getCube(cubeid);
		if (!cubeinfo.dims) return {};
		for (var i=0;i<cubeinfo.dims.length;++i) {
			var diminfo = cubeinfo.dims[i];
			if (diminfo.dimkey==dimkey) {
				dimtable = diminfo.dimtable;
				break;
			}
		}
		//2. 获取维护表中的数据集
		if (dimtable=='') return {};
		return require('model/dimdata').get(dimtable);
	};

	// 维度ID转字面
	o.dimid2name=function(cubeid,dim,dimkey) {
		// 获取维度数据map
		var dimmap = require('./util').get_dim_data(cubeid,dim);
		if (dimmap[dimkey]) {
			return dimmap[dimkey];
		}
		return dimkey;
	};
		

	return o;
});
